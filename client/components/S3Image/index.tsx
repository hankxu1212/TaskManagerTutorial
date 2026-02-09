"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { User, FileImage, File } from "lucide-react";
import { useGetPresignedUrlQuery } from "@/state/api";

type FallbackType = "user" | "image" | "file";

type Props = {
  s3Key: string | undefined;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fallbackClassName?: string;
  fallbackType?: FallbackType;
  version?: number; // Cache buster - change to force refetch
  style?: React.CSSProperties;
};

// S3 bucket configuration for public URLs
const S3_BUCKET = "teamcrescendo-quest-default-s3";
const S3_REGION = "us-west-2";
const S3_STAGE = "dev";

// Check if s3Key is a profile image (public)
const isProfileImage = (s3Key: string): boolean => {
  return /^users\/\d+\/profile\.\w+$/.test(s3Key);
};

// Generate direct public S3 URL (no presigning needed)
const getPublicS3Url = (s3Key: string): string => {
  return `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${S3_STAGE}/${s3Key}`;
};

// Cache for presigned URLs (to avoid API calls for private content)
// Key: s3Key, Value: { url: string, expiresAt: number }
const presignedUrlCache = new Map<string, { url: string; expiresAt: number }>();

// Presigned URL cache duration: 50 minutes
const PRESIGNED_CACHE_DURATION_MS = 50 * 60 * 1000;

// Get cached presigned URL if still valid
const getCachedPresignedUrl = (s3Key: string): string | null => {
  const cached = presignedUrlCache.get(s3Key);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.url;
  }
  if (cached) {
    presignedUrlCache.delete(s3Key);
  }
  return null;
};

// Store presigned URL in cache
const setCachedPresignedUrl = (s3Key: string, url: string): void => {
  presignedUrlCache.set(s3Key, {
    url,
    expiresAt: Date.now() + PRESIGNED_CACHE_DURATION_MS,
  });
};

const S3Image = ({ 
  s3Key, 
  alt, 
  width, 
  height, 
  className, 
  fallbackClassName, 
  fallbackType = "user",
  version = 0,
  style,
}: Props) => {
  const [hasError, setHasError] = useState(false);

  // For profile images, use direct public URL (no presigning needed)
  const isPublic = s3Key ? isProfileImage(s3Key) : false;
  const publicUrl = s3Key && isPublic ? getPublicS3Url(s3Key) : null;

  // For private content, check cache first
  const cachedPresignedUrl = s3Key && !isPublic ? getCachedPresignedUrl(s3Key) : null;
  const shouldFetchPresigned = !isPublic && !cachedPresignedUrl && !!s3Key;
  
  const { data, isLoading, error } = useGetPresignedUrlQuery(s3Key!, {
    skip: !shouldFetchPresigned,
    refetchOnMountOrArgChange: version,
  });

  // Cache presigned URL when received (for private content only)
  useEffect(() => {
    if (data?.url && s3Key && !isPublic) {
      setCachedPresignedUrl(s3Key, data.url);
    }
  }, [data?.url, s3Key, isPublic]);

  // Handle version change (cache bust for private content)
  useEffect(() => {
    if (version > 0 && s3Key && !isPublic) {
      presignedUrlCache.delete(s3Key);
      setHasError(false);
    }
  }, [version, s3Key, isPublic]);

  // Determine the final URL to use
  const imageUrl = publicUrl || data?.url || cachedPresignedUrl;

  // Choose appropriate fallback icon based on type
  const getFallbackIcon = () => {
    const isLargeContainer = width > 100 || height > 100;
    const iconSize = isLargeContainer ? 48 : Math.min(width, height) * 0.6;
    const iconClass = "text-gray-500 dark:text-gray-400";
    
    switch (fallbackType) {
      case "image":
        return <FileImage className={iconClass} size={iconSize} />;
      case "file":
        return <File className={iconClass} size={iconSize} />;
      case "user":
      default:
        return <User className={iconClass} size={iconSize} />;
    }
  };

  // Show fallback if no s3Key, loading (for private content), no URL, error, or image load error
  const showFallback = !s3Key || (!isPublic && isLoading && !cachedPresignedUrl) || !imageUrl || error || hasError;

  if (showFallback) {
    const isLargeContainer = width > 100 || height > 100;
    const fallbackWidth = isLargeContainer ? 120 : width;
    const fallbackHeight = isLargeContainer ? 80 : height;
    
    return (
      <div 
        className="flex items-center justify-center"
        style={{ width, height }}
      >
        <div 
          className={fallbackClassName || `flex items-center justify-center rounded-lg bg-gray-200 dark:bg-dark-tertiary ${className}`} 
          style={{ width: fallbackWidth, height: fallbackHeight }}
        >
          {getFallbackIcon()}
        </div>
      </div>
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{ width, height, ...style }}
      unoptimized
      onError={() => setHasError(true)}
    />
  );
};

export default S3Image;
