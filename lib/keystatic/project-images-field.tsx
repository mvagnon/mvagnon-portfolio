import type {
  AssetsFormField,
  FormFieldInputProps,
  FormFieldStoredValue,
} from "@keystatic/core";
import type { ChangeEvent, CSSProperties } from "react";

type LengthValidation = {
  length?: {
    min?: number;
    max?: number;
  };
};

type ProjectImagesFieldOptions = {
  label: string;
  description?: string;
  directory: string;
  publicPath: string;
  validation?: LengthValidation;
};

const acceptedImageTypes = "image/jpeg,image/png,image/gif,image/webp";
const acceptedImageMimeTypes = new Set(acceptedImageTypes.split(","));

export type ProjectImageAsset = {
  data: Uint8Array;
  extension: string;
  filename: string;
  src: string;
};

type ProjectImagesField = AssetsFormField<
  ProjectImageAsset[],
  ProjectImageAsset[],
  string[]
>;

export function projectImagesField({
  label,
  description,
  directory,
  publicPath,
  validation,
}: ProjectImagesFieldOptions): ProjectImagesField {
  const fixedDirectory = fixPath(directory);

  return {
    kind: "form",
    formKind: "assets",
    directories: [fixedDirectory],
    Input(props) {
      return (
        <ProjectImagesFieldInput
          {...props}
          label={label}
          description={description}
          validation={validation}
        />
      );
    },
    defaultValue() {
      return [];
    },
    parse(value, args) {
      const prefix = getPublicPathPrefix(publicPath, args.slug);
      const directoryFiles = args.external.get(fixedDirectory);

      return parseStoredImagePaths(value)
        .map((src) => {
          const filename = src.slice(prefix.length);
          const data = directoryFiles?.get(filename);

          if (!data) {
            return null;
          }

          return {
            data,
            extension: getExtension(filename),
            filename,
            src,
          };
        })
        .filter(isProjectImageAsset);
    },
    serialize(value, args) {
      const prefix = getPublicPathPrefix(publicPath, args.slug);
      const files = new Map<string, Uint8Array>();
      const imagePaths = value.map((image, index) => {
        const extension = normalizeExtension(image.extension);
        const filename = `images/${index}.${extension}`;

        files.set(filename, image.data);

        return `${prefix}${filename}`;
      });

      return {
        value: imagePaths,
        other: new Map(),
        external: new Map([[fixedDirectory, files]]),
      };
    },
    validate(value) {
      const message = getValidationMessage(value, validation, label);

      if (message) {
        throw new Error(message);
      }

      return value;
    },
    reader: {
      parse(value) {
        return parseStoredImagePaths(value);
      },
    },
  };
}

function ProjectImagesFieldInput({
  value,
  onChange,
  autoFocus,
  forceValidation,
  label,
  description,
  validation,
}: FormFieldInputProps<ProjectImageAsset[]> & {
  label: string;
  description?: string;
  validation?: LengthValidation;
}) {
  const validationMessage = forceValidation
    ? getValidationMessage(value, validation, label)
    : undefined;

  async function handleFilesChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.currentTarget.files ?? []);
    event.currentTarget.value = "";

    if (files.length === 0) {
      return;
    }

    const imageFiles = files.filter(isImageFile);

    if (imageFiles.length === 0) {
      return;
    }

    const images = await Promise.all(imageFiles.map(readImageFile));

    onChange([...value, ...images]);
  }

  function removeImage(indexToRemove: number) {
    onChange(value.filter((_, index) => index !== indexToRemove));
  }

  function moveImage(indexToMove: number, direction: -1 | 1) {
    const nextIndex = indexToMove + direction;

    if (nextIndex < 0 || nextIndex >= value.length) {
      return;
    }

    const nextValue = [...value];
    const [image] = nextValue.splice(indexToMove, 1);
    nextValue.splice(nextIndex, 0, image);
    onChange(nextValue);
  }

  return (
    <div style={styles.field}>
      <div style={styles.header}>
        <label style={styles.label}>{label}</label>
        {description ? <p style={styles.description}>{description}</p> : null}
      </div>

      <label style={styles.uploadButton}>
        <input
          type="file"
          accept={acceptedImageTypes}
          multiple
          autoFocus={autoFocus}
          onChange={handleFilesChange}
          style={styles.fileInput}
        />
        Add images
      </label>

      {value.length > 0 ? (
        <ol style={styles.list}>
          {value.map((image, index) => (
            <li key={`${image.filename}-${index}`} style={styles.item}>
              {image.src ? (
                <div
                  aria-hidden="true"
                  style={getThumbnailStyle(image.src)}
                />
              ) : (
                <div aria-hidden="true" style={styles.thumbnailPlaceholder} />
              )}
              <span style={styles.filename}>{getDisplayName(image)}</span>
              <div style={styles.actions}>
                <button
                  type="button"
                  onClick={() => moveImage(index, -1)}
                  disabled={index === 0}
                  style={styles.actionButton}
                >
                  Up
                </button>
                <button
                  type="button"
                  onClick={() => moveImage(index, 1)}
                  disabled={index === value.length - 1}
                  style={styles.actionButton}
                >
                  Down
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  style={styles.removeButton}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p style={styles.empty}>No gallery images yet.</p>
      )}

      {validationMessage ? (
        <p style={styles.error}>{validationMessage}</p>
      ) : null}
    </div>
  );
}

async function readImageFile(file: File): Promise<ProjectImageAsset> {
  return {
    data: new Uint8Array(await file.arrayBuffer()),
    extension: getFileExtension(file),
    filename: file.name,
    src: "",
  };
}

function parseStoredImagePaths(value: FormFieldStoredValue): string[] {
  if (value === undefined) {
    return [];
  }

  if (
    !Array.isArray(value) ||
    !value.every((item) => typeof item === "string")
  ) {
    throw new Error("Project images must be an array of image paths.");
  }

  return value;
}

function getValidationMessage(
  value: ProjectImageAsset[],
  validation: LengthValidation | undefined,
  label: string,
) {
  const min = validation?.length?.min;
  const max = validation?.length?.max;

  if (min !== undefined && value.length < min) {
    return `${label} must contain at least ${min} image${min === 1 ? "" : "s"}.`;
  }

  if (max !== undefined && value.length > max) {
    return `${label} must contain at most ${max} image${max === 1 ? "" : "s"}.`;
  }

  return undefined;
}

function getDisplayName(image: ProjectImageAsset) {
  return image.filename.split("/").at(-1) ?? image.filename;
}

function getThumbnailStyle(src: string): CSSProperties {
  return {
    ...styles.thumbnail,
    backgroundImage: `url("${src.replaceAll('"', '\\"')}")`,
  };
}

function getPublicPathPrefix(publicPath: string, slug: string | undefined) {
  return `${publicPath.replace(/\/*$/, "")}/${slug === undefined ? "" : `${slug}/`}`;
}

function fixPath(path: string) {
  return path.replace(/^\.?\/+/, "").replace(/\/*$/, "");
}

function getExtension(filename: string) {
  return normalizeExtension(filename.split(".").at(-1) ?? "png");
}

function getFileExtension(file: File) {
  const filenameExtension = file.name.split(".").at(-1);

  if (filenameExtension && filenameExtension !== file.name) {
    return normalizeExtension(filenameExtension);
  }

  if (file.type === "image/jpeg") {
    return "jpg";
  }

  return normalizeExtension(file.type.replace(/^image\//, "") || "png");
}

function isImageFile(file: File) {
  return acceptedImageMimeTypes.has(file.type) || hasImageExtension(file.name);
}

function hasImageExtension(filename: string) {
  return /\.(gif|jpe?g|png|webp)$/i.test(filename);
}

function normalizeExtension(extension: string) {
  const normalizedExtension = extension.replace(/^\./, "").toLowerCase();

  return normalizedExtension.length > 0 ? normalizedExtension : "png";
}

function isProjectImageAsset(
  value: ProjectImageAsset | null,
): value is ProjectImageAsset {
  return value !== null;
}

const styles = {
  field: {
    display: "grid",
    gap: 12,
  },
  header: {
    display: "grid",
    gap: 4,
  },
  label: {
    color: "var(--ksv-color-foreground-neutral)",
    fontSize: 14,
    fontWeight: 600,
  },
  description: {
    color: "var(--ksv-color-foreground-neutral-secondary)",
    fontSize: 13,
    margin: 0,
  },
  uploadButton: {
    alignItems: "center",
    border: "1px solid var(--ksv-color-border-neutral)",
    borderRadius: 6,
    cursor: "pointer",
    display: "inline-flex",
    fontSize: 14,
    fontWeight: 600,
    gap: 8,
    justifyContent: "center",
    minHeight: 36,
    padding: "0 12px",
    width: "fit-content",
  },
  fileInput: {
    display: "none",
  },
  list: {
    display: "grid",
    gap: 8,
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  item: {
    alignItems: "center",
    border: "1px solid var(--ksv-color-border-neutral)",
    borderRadius: 6,
    display: "grid",
    gap: 10,
    gridTemplateColumns: "48px minmax(0, 1fr) auto",
    minHeight: 64,
    padding: 8,
  },
  thumbnail: {
    aspectRatio: "1",
    backgroundPosition: "center",
    backgroundSize: "cover",
    borderRadius: 4,
    height: 48,
    width: 48,
  },
  thumbnailPlaceholder: {
    aspectRatio: "1",
    background: "var(--ksv-color-background-neutral)",
    border: "1px solid var(--ksv-color-border-neutral)",
    borderRadius: 4,
    height: 48,
    width: 48,
  },
  filename: {
    fontSize: 13,
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  actions: {
    display: "flex",
    gap: 6,
  },
  actionButton: {
    minHeight: 32,
    padding: "0 8px",
  },
  removeButton: {
    minHeight: 32,
    padding: "0 8px",
  },
  empty: {
    color: "var(--ksv-color-foreground-neutral-secondary)",
    fontSize: 13,
    margin: 0,
  },
  error: {
    color: "var(--ksv-color-foreground-critical)",
    fontSize: 13,
    margin: 0,
  },
} satisfies Record<string, CSSProperties>;
