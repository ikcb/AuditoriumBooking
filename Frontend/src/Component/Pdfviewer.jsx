import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const PDFViewer = ({ base64Data }) => {
  return (
    <div>
      <Document file={`data:application/pdf;base64,${base64Data}`}>
        <Page pageNumber={1} />
      </Document>
    </div>
  );
};

export default PDFViewer;
