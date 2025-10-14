import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../src/print.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const LeavingCertificate = ({ student, onClose, onSave, isEdit = false }) => {
  const [certificateData, setCertificateData] = useState({
    enrollmentNumber: student?.enrollmentNumber || '',
    name: student?.name || '',
    motherName: student?.motherName || '',
    religion: student?.religion || student?.personalDetails?.religion || 'Hindu',
    caste: student?.caste || student?.personalDetails?.caste || 'OBC',
    nationality: student?.nationality || student?.personalDetails?.nationality || 'Indian',
    placeOfBirth: student?.placeOfBirth || student?.personalDetails?.placeOfBirth || 'Mumbai',
    dateOfBirth: student?.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : (student?.personalDetails?.dateOfBirth ? new Date(student.personalDetails.dateOfBirth).toISOString().split('T')[0] : ''),
    instituteLastAttended: student?.instituteLastAttended || student?.personalDetails?.instituteLastAttended || 'ABC High School, Mumbai',
    dateOfAdmission: student?.dateOfAdmission ? new Date(student.dateOfAdmission).toISOString().split('T')[0] : (student?.personalDetails?.dateOfAdmission ? new Date(student.personalDetails.dateOfAdmission).toISOString().split('T')[0] : ''),
    branch: student?.branch || student?.course || 'Diploma in Information Technology',
    classAndYear: student?.classAndYear || student?.year || 'Third Year',
    conduct: student?.personalDetails?.conduct || 'Very Good',
    reasonForLeaving: student?.personalDetails?.reasonForLeaving || 'Completion of Course',
    remarks: student?.personalDetails?.remarks || 'Good Academic Record',
    dateOfLeaving: new Date().toISOString().split('T')[0]
  });

  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (field, value) => {
    setCertificateData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  const formatDateInWords = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    
    const dayNames = {
      1: 'First', 2: 'Second', 3: 'Third', 4: 'Fourth', 5: 'Fifth',
      6: 'Sixth', 7: 'Seventh', 8: 'Eighth', 9: 'Ninth', 10: 'Tenth',
      11: 'Eleventh', 12: 'Twelfth', 13: 'Thirteenth', 14: 'Fourteenth', 15: 'Fifteenth',
      16: 'Sixteenth', 17: 'Seventeenth', 18: 'Eighteenth', 19: 'Nineteenth', 20: 'Twentieth',
      21: 'Twenty-first', 22: 'Twenty-second', 23: 'Twenty-third', 24: 'Twenty-fourth', 25: 'Twenty-fifth',
      26: 'Twenty-sixth', 27: 'Twenty-seventh', 28: 'Twenty-eighth', 29: 'Twenty-ninth', 30: 'Thirtieth',
      31: 'Thirty-first'
    };
    
    const yearWords = {
      2000: 'Two Thousand',
      2001: 'Two Thousand One',
      2002: 'Two Thousand Two',
      2003: 'Two Thousand Three',
      2004: 'Two Thousand Four',
      2005: 'Two Thousand Five',
      2006: 'Two Thousand Six',
      2007: 'Two Thousand Seven',
      2008: 'Two Thousand Eight',
      2009: 'Two Thousand Nine',
      2010: 'Two Thousand Ten',
      2011: 'Two Thousand Eleven',
      2012: 'Two Thousand Twelve',
      2013: 'Two Thousand Thirteen',
      2014: 'Two Thousand Fourteen',
      2015: 'Two Thousand Fifteen',
      2016: 'Two Thousand Sixteen',
      2017: 'Two Thousand Seventeen',
      2018: 'Two Thousand Eighteen',
      2019: 'Two Thousand Nineteen',
      2020: 'Two Thousand Twenty',
      2021: 'Two Thousand Twenty One',
      2022: 'Two Thousand Twenty Two',
      2023: 'Two Thousand Twenty Three',
      2024: 'Two Thousand Twenty Four',
      2025: 'Two Thousand Twenty Five',
      2026: 'Two Thousand Twenty Six'
    };
    
    return `${dayNames[day] || day} ${month} ${yearWords[year] || year}`;
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await onSave(certificateData);
      setShowPreview(true);
    } catch (error) {
      console.error('Error generating certificate:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    try {
      const element = document.querySelector('.certificate-print');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Leaving_Certificate_${certificateData.enrollmentNumber}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const CertificatePreview = () => (
    <div className="certificate-print bg-white p-8 max-w-4xl mx-auto shadow-lg" style={{ minHeight: '297mm' }}>
      {/* Top Header */}
      <div className="text-center mb-4">
        <p className="text-sm font-semibold text-gray-800 mb-2">MAKING KNOWLEDGE TO WORK</p>
      </div>

      {/* Institute Info */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">GOVERNMENT POLYTECHNIC MUMBAI</h2>
        <p className="text-lg text-gray-700 mb-1">शासकीय तंत्रनिकेतन मुंबई</p>
        <p className="text-sm text-gray-600 mb-2">49, KHERWADI, ALI YAWAK JUNG MARG, BANDRA (EAST), MUMBAI-400 051</p>
        <p className="text-sm text-gray-600 mb-1">(Autonomous status granted by Govt. of Maharashtra)</p>
        <p className="text-sm text-gray-600">(Approved by AICTE, New Delhi and Equivalent to MSBTE, Mumbai)</p>
      </div>

      {/* Enrollment and Date */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-sm text-gray-700 font-semibold">ENROLLMENT NO.: {certificateData.enrollmentNumber}</p>
        </div>
        <div>
          <p className="text-sm text-gray-700">Date: {formatDate(certificateData.dateOfLeaving)}</p>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">LEAVING CERTIFICATE</h1>
        <p className="text-sm text-gray-600 mb-2">ORIGINAL COPY</p>
        <p className="text-sm text-gray-700">
          Certified that the following information is in accordance with the Institute Records:
        </p>
      </div>

      {/* Main Content */}
      <div className="mb-8">
        <div className="space-y-2 text-sm text-gray-700">
          <p><span className="font-semibold">1. Registered Number of Candidate:</span> {certificateData.enrollmentNumber}</p>
          <p><span className="font-semibold">2. Name of the Candidate (in full):</span> {certificateData.name}</p>
          <p><span className="font-semibold">3. Mother Name:</span> {certificateData.motherName}</p>
          <p><span className="font-semibold">4. Religion:</span> {certificateData.religion}</p>
          <p><span className="font-semibold">5. Caste & SubCaste:</span> {certificateData.caste}</p>
          <p><span className="font-semibold">6. Mother Tongue:</span> Guju</p>
          <p><span className="font-semibold">7. Nationality:</span> {certificateData.nationality}</p>
          <p><span className="font-semibold">8. Place of Birth:</span> {certificateData.placeOfBirth}</p>
          <p><span className="font-semibold">9. Date of Birth:</span> {formatDate(certificateData.dateOfBirth)}</p>
          <p className="ml-4 text-xs text-gray-600">According to the Christian era (in words): {formatDateInWords(certificateData.dateOfBirth)}</p>
          <p><span className="font-semibold">10. Institute Last Attended:</span> {certificateData.instituteLastAttended}</p>
          <p><span className="font-semibold">11. Date of Admission:</span> {formatDate(certificateData.dateOfAdmission)}</p>
          <p><span className="font-semibold">12. Branch/Class & Year in which Admitted:</span> {certificateData.branch} - {certificateData.classAndYear}</p>
          <p><span className="font-semibold">13. Conduct:</span> {certificateData.conduct}</p>
          <p><span className="font-semibold">14. Reason for leaving Institute:</span> {certificateData.reasonForLeaving}</p>
          <p><span className="font-semibold">15. Remarks:</span> {certificateData.remarks}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-right">
        <p className="text-sm text-gray-500">1/2</p>
      </div>
    </div>
  );

  if (showPreview) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-auto">
          <div className="p-4 border-b flex justify-between items-center no-print">
            <h3 className="text-lg font-semibold">Certificate Preview</h3>
            <div className="flex gap-2">
              <button
                onClick={handleDownloadPDF}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                📄 Download PDF
              </button>
              <button
                onClick={handlePrint}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                🖨️ Print Certificate
              </button>
              <button
                onClick={() => setShowPreview(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                ✏️ Edit Certificate
              </button>
              <button
                onClick={() => setShowPreview(false)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                ❌ Close Preview
              </button>
            </div>
          </div>
          <div className="p-4">
            <CertificatePreview />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div 
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {isEdit ? 'Edit Certificate' : 'Generate Leaving Certificate'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Number</label>
                <input
                  type="text"
                  value={certificateData.enrollmentNumber}
                  onChange={(e) => handleInputChange('enrollmentNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={certificateData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name</label>
                <input
                  type="text"
                  value={certificateData.motherName}
                  onChange={(e) => handleInputChange('motherName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                <select
                  value={certificateData.religion}
                  onChange={(e) => handleInputChange('religion', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Hindu">Hindu</option>
                  <option value="Muslim">Muslim</option>
                  <option value="Christian">Christian</option>
                  <option value="Sikh">Sikh</option>
                  <option value="Buddhist">Buddhist</option>
                  <option value="Jain">Jain</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Caste & SubCaste</label>
                <input
                  type="text"
                  value={certificateData.caste}
                  onChange={(e) => handleInputChange('caste', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                <input
                  type="text"
                  value={certificateData.nationality}
                  onChange={(e) => handleInputChange('nationality', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Place of Birth</label>
                <input
                  type="text"
                  value={certificateData.placeOfBirth}
                  onChange={(e) => handleInputChange('placeOfBirth', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={certificateData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Institute Last Attended</label>
                <input
                  type="text"
                  value={certificateData.instituteLastAttended}
                  onChange={(e) => handleInputChange('instituteLastAttended', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Admission</label>
                <input
                  type="date"
                  value={certificateData.dateOfAdmission}
                  onChange={(e) => handleInputChange('dateOfAdmission', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                <input
                  type="text"
                  value={certificateData.branch}
                  onChange={(e) => handleInputChange('branch', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class and Year</label>
                <input
                  type="text"
                  value={certificateData.classAndYear}
                  onChange={(e) => handleInputChange('classAndYear', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Conduct</label>
                <select
                  value={certificateData.conduct}
                  onChange={(e) => handleInputChange('conduct', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Excellent">Excellent</option>
                  <option value="Very Good">Very Good</option>
                  <option value="Good">Good</option>
                  <option value="Satisfactory">Satisfactory</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Leaving Institute</label>
                <input
                  type="text"
                  value={certificateData.reasonForLeaving}
                  onChange={(e) => handleInputChange('reasonForLeaving', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <textarea
                  value={certificateData.remarks}
                  onChange={(e) => handleInputChange('remarks', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Leaving Institute</label>
                <input
                  type="date"
                  value={certificateData.dateOfLeaving}
                  onChange={(e) => handleInputChange('dateOfLeaving', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
            >
              {isGenerating ? 'Generating...' : (isEdit ? 'Update Certificate' : 'Generate Certificate')}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LeavingCertificate;
