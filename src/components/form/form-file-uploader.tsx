"use client";

import { UploadCloudIcon, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  FileUpload,
  FileUploadClear,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
} from "../ui/file-upload";
import { FormBase, type FormControlProps } from "./form-base";
import { useFieldContext } from "./hooks";

type ExtraProps = {
  accept?: string;
  maxSize?: number;
  maxFiles?: number;
  multiple?: boolean;
  fileUrl?: string | File;
};

export function FormFileUploader(props: FormControlProps & ExtraProps) {
  const {
    accept = "image/*",
    maxSize,
    maxFiles = 1,
    multiple = false,
    fileUrl,
  } = props;

  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!fileUrl) {
      setPreviewSrc(null);
      return;
    }

    if (typeof fileUrl === "string") {
      setPreviewSrc(fileUrl);
      return;
    }

    const objectUrl = URL.createObjectURL(fileUrl);
    setPreviewSrc(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [fileUrl]);

  const field = useFieldContext<File | File[]>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const currentFiles = Array.isArray(field.state.value)
    ? field.state.value
    : field.state.value
      ? [field.state.value]
      : [];

  const handleValueChange = (files: File[]) => {
    if (maxFiles === 1) {
      field.handleChange(files[0] || null);
    } else {
      field.handleChange(files);
    }
  };

  return (
    <FormBase {...props}>
      <FileUpload
        accept={accept}
        invalid={isInvalid}
        maxFiles={maxFiles}
        maxSize={maxSize}
        multiple={multiple}
        onBlur={() => {
          field.handleBlur();
          field.setMeta((prev) => ({
            ...prev,
            errorMap: {
              ...prev.errorMap,
              onServer: undefined,
            },
          }));
        }}
        onValueChange={handleValueChange}
        value={currentFiles}
      >
        <div className="space-y-4">
          {previewSrc && (
            <div className="rounded-lg border border-muted-foreground/25 border-dashed p-3">
              <Image
                alt="Current uploaded file"
                className="mx-auto h-20 w-20 rounded-md object-cover"
                height={80}
                src={previewSrc}
                width={80}
              />
            </div>
          )}

          <FileUploadDropzone className="cursor-pointer border border-black hover:bg-foreground/10">
            <div className="flex flex-col items-center gap-1">
              <UploadCloudIcon className="size-6 text-muted-foreground" />
              <div className="font-medium text-sm">
                Drop your files here or click to upload
              </div>
              <p className="text-muted-foreground text-xs">
                Supported format: {accept}
              </p>
              <p className="text-muted-foreground text-xs">
                {maxSize && `Max size: ${(maxSize / 1024 / 1024).toFixed(2)}MB`}
              </p>
            </div>
          </FileUploadDropzone>

          <FileUploadList>
            {currentFiles.map((file, index) => (
              <FileUploadItem key={`${file.name}-${index}`} value={file}>
                <div className="flex w-full items-center gap-2">
                  <FileUploadItemPreview className="bg-transparent" />
                  <FileUploadItemMetadata />
                  <FileUploadItemDelete asChild>
                    <Button className="size-7" size="icon" variant="ghost">
                      <X />
                    </Button>
                  </FileUploadItemDelete>
                </div>
              </FileUploadItem>
            ))}
          </FileUploadList>
        </div>
        <FileUploadClear forceMount />
      </FileUpload>
    </FormBase>
  );
}
