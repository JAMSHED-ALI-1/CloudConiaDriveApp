// Helper function to get MIME type based on file extension
const getMimeType = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase(); // Get file extension and make it lowercase
    switch (ext) {
      case 'png':
        return 'image/png';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'gif':
        return 'image/gif';
      case 'pdf':
        return 'application/pdf';
      case 'mp4':
        return 'video/mp4';
      case 'mp3':
        return 'audio/mpeg';
      case 'txt':
        return 'text/plain';
      case 'zip':
        return 'application/zip';
      case 'html':
        return 'text/html';
      case 'css':
        return 'text/css';
      case 'json':
        return 'application/json';
      case 'csv':
        return 'text/csv';
      case 'xml':
        return 'application/xml';
      default:
        return 'application/octet-stream'; // Default binary stream for unknown types
    }
  };
export default getMimeType;  