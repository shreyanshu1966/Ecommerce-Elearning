import { Circle, Check, Clock, Package, Truck, CreditCard, Calendar, AlertCircle } from "lucide-react";

const OrderTimeline = ({ order }) => {
  // Define timeline steps and their status
  const steps = [
    {
      id: 'created',
      title: 'Order Placed',
      description: 'Order received',
      icon: Calendar,
      date: order.createdAt,
      completed: true, // Always completed since order exists
      current: !order.isPaid && !order.isDelivered
    },
    {
      id: 'paid',
      title: 'Payment Confirmed',
      description: order.paymentMethod,
      icon: CreditCard,
      date: order.paidAt,
      completed: order.isPaid,
      current: order.isPaid && !order.isDelivered && hasPhysicalProducts(order)
    },
    {
      id: 'processing',
      title: 'Processing',
      description: 'Order is being prepared',
      icon: Package,
      date: order.isPaid ? new Date(new Date(order.paidAt).getTime() + 1000 * 60 * 60) : null, // 1 hour after payment
      completed: order.isPaid && hasPhysicalProducts(order),
      current: order.isPaid && !order.isDelivered && hasPhysicalProducts(order),
      skip: !hasPhysicalProducts(order) // Skip for digital-only orders
    },
    {
      id: 'shipped',
      title: 'Shipped',
      description: 'Order has been shipped',
      icon: Truck,
      date: order.isDelivered ? new Date(new Date(order.deliveredAt).getTime() - 1000 * 60 * 60 * 24) : null, // 1 day before delivery
      completed: order.isDelivered,
      current: false,
      skip: !hasPhysicalProducts(order) // Skip for digital-only orders
    },
    {
      id: 'delivered',
      title: 'Delivered',
      description: 'Order has been delivered',
      icon: Check,
      date: order.deliveredAt,
      completed: order.isDelivered,
      current: order.isDelivered,
      skip: !hasPhysicalProducts(order) // Skip for digital-only orders
    }
  ];

  // Helper function to check if order contains physical products
  function hasPhysicalProducts(order) {
    return order.orderItems.some(item => item.itemType === "Product");
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filter out steps that should be skipped
  const relevantSteps = steps.filter(step => !step.skip);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-500" />
          Order Timeline
        </h3>
      </div>
      
      <div className="p-6">
        <ol className="relative border-l border-gray-200 ml-3">
          {relevantSteps.map((step, index) => (
            <li key={step.id} className="mb-6 ml-6 last:mb-0">
              <span className={`absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-4 ring-white ${
                step.completed 
                  ? 'bg-green-100' 
                  : step.current 
                    ? 'bg-blue-100' 
                    : 'bg-gray-100'
              }`}>
                {step.completed ? (
                  <Check className={`w-4 h-4 ${step.current ? 'text-blue-500' : 'text-green-500'}`} />
                ) : (
                  <step.icon className="w-4 h-4 text-gray-500" />
                )}
              </span>
              
              <h3 className={`flex items-center mb-1 text-lg font-semibold ${
                step.current 
                  ? 'text-blue-600' 
                  : step.completed 
                    ? 'text-gray-900' 
                    : 'text-gray-400'
              }`}>
                {step.title}
                
                {step.current && (
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded ml-3">
                    Current
                  </span>
                )}
              </h3>
              
              <time className="block mb-2 text-sm font-normal leading-none text-gray-400">
                {step.date ? formatDate(step.date) : "Pending"}
              </time>
              
              <p className="text-base font-normal text-gray-500">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default OrderTimeline;