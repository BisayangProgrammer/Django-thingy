import { useState } from 'react';
import MainLayout from './components/MainLayout';
import Home from './components/Home'; // Ensure this points to your new Home.jsx
import Customers from './components/Customers';
import Products from './components/Products';
import Orders from './components/Orders';
import OrderItems from './components/OrderItems';

function App() {
  // Set default to 'Home' to see your new dashboard immediately
  const [activeTab, setActiveTab] = useState('Home');

  const renderContent = () => {
    switch(activeTab) {
      case 'Home': 
        return <Home />; // This renders your new Solace Coalition dashboard
      case 'Customers': 
        return <Customers />;
      case 'Products': 
        return <Products />;
      case 'Orders': 
        return <Orders />;
      case 'Order Items': 
        return <OrderItems />;
      default: 
        return <Home />;
    }
  };

  return (
    <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </MainLayout>
  );
}

export default App;