const getItemIcon = (item) => {
    if (item.type === 'folder') return 'folder';
  
    // Extract file extension from the item name
    const extension = item.name.split('.').pop().toLowerCase();
  
    switch (extension) {
      // Images
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
      case 'tiff':
      case 'webp':
      case 'svg':
        return 'image';
  
      // Documents
      case 'doc':
      case 'docx':
        return 'wordpress'; // Consider using a different icon for Word documents
      case 'pdf':
        return 'picture-as-pdf';
      case 'odt':
      case 'rtf':
      case 'txt':
      case 'md':
        return 'my-library-books';
  
      // Presentations
      case 'ppt':
      case 'pptx':
      case 'odp':
      case 'key':
        return 'slideshow';
  
      // Spreadsheets
      case 'xls':
      case 'xlsx':
      case 'ods':
      case 'csv':
        return 'table_chart';
  
      // Audio
      case 'mp3':
      case 'wav':
      case 'flac':
      case 'aac':
      case 'ogg':
        return 'audiotrack';
  
      // Video
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'mkv':
      case 'webm':
        return 'videocam';
  
      // Archives
      case 'zip':
      case 'rar':
      case 'tar':
      case 'gz':
        return 'archive';
  
      // Executables and Apps
      case 'exe':
      case 'app':
      case 'apk':
        return 'developer_mode';
  
      // Default
      default:
        return 'insert-drive-file';
    }
  };
  export default getItemIcon