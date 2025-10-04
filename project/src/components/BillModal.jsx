import React from 'react';
import { X, FileText, Calendar, MapPin, Package, CreditCard, Download, Printer as Print } from 'lucide-react';

const BillModal = ({ isOpen, onClose, billData }) => {
  if (!isOpen || !billData) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a simple text version of the bill
    const billText = `
GAS CYLINDER BOOKING SYSTEM
===========================

BILL/INVOICE
Bill ID: ${billData.billId}
Date: ${new Date(billData.date).toLocaleDateString()}

CUSTOMER DETAILS:
Name: ${billData.customerName}
Address: ${billData.address}

ORDER DETAILS:
${billData.items.map(item => 
  `${item.type} x ${item.quantity} = ₹${item.cost * item.quantity}`
).join('\n')}

PAYMENT DETAILS:
Subtotal: ₹${billData.subtotal}
Tax (18%): ₹${billData.tax}
Total Amount: ₹${billData.total}
Payment Method: ${billData.paymentMethod}
${billData.transactionId ? `Transaction ID: ${billData.transactionId}` : ''}
Payment Status: ${billData.paymentStatus}

Thank you for your business!
    `;

    const blob = new Blob([billText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bill-${billData.billId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Bill/Invoice
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 print:p-8" id="bill-content">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Gas Cylinder Booking System</h1>
            <p className="text-gray-600">Your Trusted Gas Cylinder Provider</p>
          </div>

          {/* Bill Info */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Bill Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">Bill ID:</span>
                  <span className="ml-2 font-medium">{billData.billId}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">Date:</span>
                  <span className="ml-2 font-medium">{new Date(billData.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Customer Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start">
                  <span className="text-gray-600 min-w-[60px]">Name:</span>
                  <span className="font-medium">{billData.customerName}</span>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <span className="text-gray-600">Address:</span>
                    <div className="font-medium">{billData.address}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="h-4 w-4 mr-2" />
              Order Details
            </h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Item</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">Qty</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Rate</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {billData.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.type}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-center">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">₹{item.cost}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                        ₹{item.cost * item.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-end">
              <div className="w-64">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">₹{billData.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (18%):</span>
                    <span className="font-medium">₹{billData.tax}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Amount:</span>
                      <span className="text-green-600">₹{billData.total}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Payment Details
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Method:</span>
                      <span className="font-medium">{billData.paymentMethod}</span>
                    </div>
                    {billData.transactionId && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transaction ID:</span>
                        <span className="font-medium text-xs">{billData.transactionId}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-medium ${
                        billData.paymentStatus === 'Paid' ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {billData.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
            <p>Thank you for choosing Gas Cylinder Booking System!</p>
            <p className="mt-1">For any queries, contact us at support@gascylinder.com</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 print:hidden">
          <button
            onClick={handleDownload}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Print className="h-4 w-4 mr-2" />
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillModal;