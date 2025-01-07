
import FolderIcon from '../assets/FileFolderIcons/FolderIcon.png';
import ImageIcon from '../assets/FileFolderIcons/ImageFileIcon.png';
import PowerPointIcon from '../assets/FileFolderIcons/PowerPointFileIcon.png';
import PdfFileIcon from '../assets/FileFolderIcons/PdfFileIcon.png';
import VideoFileIcon from '../assets/FileFolderIcons/VideoFileIcon.png';
import TextFileIcon from '../assets/FileFolderIcons/TextFileIcon.png';
import WordFileIcon from '../assets/FileFolderIcons/WordFileIcon.png';
import SpreadsheetIcon from '../assets/FileFolderIcons/SpreadsheetFileIcon.png';
import AudioFileIcon from '../assets/FileFolderIcons/AudioFileIcons.png';
import DefaultFileIcon from '../assets/FileFolderIcons/DefaultFileIcon.png';
import ApkFileIcon from '../assets/FileFolderIcons/apk.png'
import ZipIcon from '../assets/FileFolderIcons/Zip.png'

const getItemIcon = (item) => {
  if (item.type === 'folder') return FolderIcon;

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
      return ImageIcon;

    // Documents
    case 'doc':
    case 'docx':
      return WordFileIcon;
    case 'pdf':
      return PdfFileIcon;
    case 'odt':
    case 'rtf':
    case 'txt':
    case 'md':
      return TextFileIcon;

    // Presentations
    case 'ppt':
    case 'pptx':
    case 'odp':
    case 'key':
      return PowerPointIcon;

    // Spreadsheets
    case 'xls':
    case 'xlsx':
    case 'ods':
    case 'csv':
      return SpreadsheetIcon;

    // Audio
    case 'mp3':
    case 'wav':
    case 'flac':
    case 'aac':
    case 'ogg':
      return AudioFileIcon;

    // Video
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'mkv':
    case 'webm':
      return VideoFileIcon;

    // Archives
    case 'zip':
    case 'rar':
    case 'tar':
    case 'gz':
      return ZipIcon;

    // Executables and Apps
    case 'exe':
    case 'app':
    case 'apk':
      return ApkFileIcon;

    // Default
    default:
      return DefaultFileIcon;
  }
};

export default getItemIcon;
