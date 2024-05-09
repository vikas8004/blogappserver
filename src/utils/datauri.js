import DatauriParser from "datauri/parser.js";
import path from "path";
const formatFile = (filePath) => {
  const dataUri = new DatauriParser();
  const extname = path.extname(filePath.originalname);
  return dataUri.format(extname, filePath.buffer);
};

export default formatFile;
