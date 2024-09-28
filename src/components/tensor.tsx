"use client";

import React, { useState, useEffect, useCallback } from "react";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import { useDropzone } from "react-dropzone";
import { ImageUp } from "lucide-react";
import { Button } from "./ui/button";
import Loading from "./loading";
import Image from "next/image";

interface ClassificationResult {
  className: string;
  probability: number;
}

const DropzoneImageUploader: React.FC = () => {
  const [isModelLoading, setIsModelLoading] = useState<boolean>(false);
  const [model, setModel] = useState<mobilenet.MobileNet | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [results, setResults] = useState<ClassificationResult[]>([]);

  const loadBackend = async () => {
    await tf.setBackend("webgl"); // Set to 'cpu' if preferred
  };

  const loadModel = useCallback(async () => {
    setIsModelLoading(true);
    try {
      await loadBackend();
      const loadedModel = await mobilenet.load();
      setModel(loadedModel);
    } catch (error) {
      console.error("Error loading the model:", error);
    } finally {
      setIsModelLoading(false);
    }
  }, []); // No dependencies, so it won't change on every render

  useEffect(() => {
    loadModel();
  }, [loadModel]); // Now this is stable

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const url = URL.createObjectURL(acceptedFiles[0]);
      setImageUrl(url);

      const img = new window.Image();
      img.src = url;
      img.onload = async () => {
        if (model) {
          const results = await model.classify(img);
          console.log("results", results);
          setResults(results);
        }
      };
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false, // Only allow one file at a time
    accept: {
      "image/*": [], // Accept all image files
    },
  });

  if (isModelLoading) {
    return <Loading />;
  }

  return (
    <div className="h-full w-full md:w-[50%] mx-auto">
      <div
        {...getRootProps()}
        className="border-dashed rounded-md border-2 h-full w-full space-y-3 flex flex-col justify-center items-center p-8 text-center"
      >
        <input {...getInputProps()} />
        <ImageUp className="h-12 w-12" />
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="Uploaded"
            width={180}
            height={300}
            className="mt-4 max-h-64"
            layout="responsive" // Optional, adjusts based on screen size
          />
        ) : (
          <>
        <p className="font-semibold text-xl">Drag &apos;n&apos; drop an image here</p>
        <p className="font-semibold">or</p>
          </>
        )}
        <Button
          onClick={() => document.getElementById("file-upload-input")?.click()}
          className="mt-2 w-full"
        >
          Select a file
        </Button>
      </div>

      {results.length > 0 && (
        <div className="mt-4 p-4 border border-gray-300 rounded-md shadow-md">
          <h2 className="text-xl font-bold mb-2">Detection Results</h2>
          {results.map((result) => (
            <div
              className="result flex justify-between items-center p-2 mb-2 border-b last:border-b-0"
              key={result.className}
            >
              <span className="name font-semibold text-lg">
                {result.className}
              </span>
              <span className="accuracy text-gray-500">
                Accuracy Level: {(result.probability * 100).toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropzoneImageUploader;
