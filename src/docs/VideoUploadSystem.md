
# Video Upload System

This document explains the new video upload system implemented in this project.

## Overview

The video upload system is designed to be simple, reliable, and capable of handling large files. It uses Supabase Storage for file storage and generates thumbnails automatically.

## Storage Buckets

There are two storage buckets used:

1. `videos` - For storing the actual video files (up to 10GB)
2. `thumbnails` - For storing video thumbnails (up to 50MB)

## Database Structure

Videos are stored in the `media` table with the following fields:

- `id`: Unique identifier (UUID)
- `title`: Video title
- `description`: Optional description
- `type`: Set to 'video'
- `file_url`: URL to the video file
- `video_url`: URL to the video file (duplicate for compatibility)
- `thumbnail_url`: URL to the thumbnail image
- `is_published`: Whether the video is published
- `is_featured`: Whether the video is featured on the homepage
- `orientation`: 'horizontal' or 'vertical'
- `file_type`: MIME type of the video
- `file_size`: Size of the video in bytes

## Upload Process

1. User selects a video file through the uploader
2. The file is uploaded directly to Supabase Storage (videos bucket)
3. A thumbnail is generated from the video automatically
4. A record is created in the media table

## Playback Process

The VideoPlayer component handles playback. It supports:

- Regular video files from Supabase Storage
- YouTube embeds
- Thumbnails with play button
- Vertical and horizontal videos
- Autoplay (optional)
- Muted playback (optional)

## Limitations

- Maximum file size is 10GB (configurable in Supabase)
- Supported formats: MP4, WebM, MOV, and other standard web video formats
- Thumbnail generation happens in the browser, so it may not work for very large files
