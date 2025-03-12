import Imagepath from "../../constants/imagpath";
import strings from "../../helper/Language/LocalizedStrings";
import ic_folderIcon from '../../assets/icon/folder.png';
import ic_fileIcon  from '../../assets/icon/file.png';
import ic_imageIcon from '../../assets/icon/image.png';
import ic_vedioIcon from '../../assets/icon/video.png';
import ic_allIcon from '../../assets/icon/all.png';


export const FilterData = [
  { id: 1, Image: ic_folderIcon, title: strings.Folder, filters: 'W3sia2V5IjoidHlwZSIsInZhbHVlIjoiZm9sZGVyIiwiaXNJbmFjdGl2ZSI6ZmFsc2UsIm9wZXJhdG9yIjoiPSIsInZhbHVlS2V5IjoiMTEifV0%3D' },
  { id: 2, Image: ic_fileIcon, title: strings.File, filters: 'W3sia2V5IjoidHlwZSIsInZhbHVlIjoidGV4dCIsImlzSW5hY3RpdmUiOmZhbHNlLCJvcGVyYXRvciI6Ij0iLCJ2YWx1ZUtleSI6IjAyIn1d' },
  { id: 3, Image: ic_imageIcon, title: strings.Image, filters: 'W3sia2V5IjoidHlwZSIsInZhbHVlIjoiaW1hZ2UiLCJpc0luYWN0aXZlIjpmYWxzZSwib3BlcmF0b3IiOiI9IiwidmFsdWVLZXkiOiIwNSJ9XQ%3D%3D' },
  { id: 4, Image: ic_vedioIcon, title:strings.Video, filters: 'W3sia2V5IjoidHlwZSIsInZhbHVlIjoidmlkZW8iLCJpc0luYWN0aXZlIjpmYWxzZSwib3BlcmF0b3IiOiI9IiwidmFsdWVLZXkiOiIwNCJ9XQ%3D%3D' },
  { id: 4, Image: ic_allIcon, title:strings.ALL, filters: '' },
];