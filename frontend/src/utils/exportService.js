/**
 * Utility for exporting order data to CSV format
 */

/**
 * Export orders to CSV file
 * @param {Array} orders - Array of order objects to export
 * @param {String} filename - Name for the exported file
 */
export const exportOrdersToCsv = (orders, filename = 'order-export') => {
  if (!orders || orders.length === 0) {
    console.error('No orders to export');
    return;
  }

  try {
    // Format date for the filename
    const dateStr = new Date().toISOString().split('T')[0];
    const fullFilename = `${filename}-${dateStr}.csv`;
    
    // Define CSV headers
    const headers = [
      'Order ID',
      'Date',
      'Customer Name',
      'Customer Email',
      'Items',
      'Total Amount',
      'Payment Status',
      'Payment Date',
      'Transaction ID',
      'Delivery Status',
      'Delivery Date',
      'Shipping Address'
    ];
    
    // Format order data for CSV
    const rows = orders.map(order => {
      // Format order items into a comma-separated list
      const itemsList = order.orderItems
        .map(item => `${item.quantity}x ${item.name} ($${item.price})`)
        .join(', ');
      
      // Format address if it exists
      const address = order.shippingAddress && Object.keys(order.shippingAddress).length 
        ? `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`
        : 'N/A (Digital Order)';
      
      return [
        order._id,
        new Date(order.createdAt).toLocaleString(),
        order.user?.name || 'N/A',
        order.user?.email || 'N/A',
        itemsList,
        order.totalPrice.toFixed(2),
        order.isPaid ? 'Paid' : 'Pending',
        order.isPaid ? new Date(order.paidAt).toLocaleString() : 'N/A',
        order.paymentResult?.razorpay_payment_id || 'N/A',
        order.isDelivered ? 'Delivered' : (hasPhysicalProducts(order) ? 'Processing' : 'N/A'),
        order.deliveredAt ? new Date(order.deliveredAt).toLocaleString() : 'N/A',
        address
      ];
    });
    
    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => 
        row.map(cell => 
          // Escape commas and quotes in the content
          `"${(cell || '').toString().replace(/"/g, '""')}"`
        ).join(',')
      )
    ].join('\n');
    
    // Create a download link and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fullFilename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error exporting orders to CSV:', error);
    throw new Error('Failed to export orders');
  }
};

// Helper function to check if an order contains physical products
const hasPhysicalProducts = (order) => {
  return order.orderItems.some(item => item.itemType === "Product");
};