/**
 * FuelStock Page
 * Manage fuel inventory, stock levels, and pricing
 * Location: bunk/src/pages/FuelStock.jsx
 */

import { useState, useEffect } from 'react';
import { FuelStockOverview } from '../components/cards/FuelStockCard';
import UpdateStockModal from '../components/modals/UpdateStockModal';
import UpdatePriceModal from '../components/modals/UpdatePriceModal';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import Loader from '../components/common/Loader';

export default function FuelStock() {
  const [stockData, setStockData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Modal states
  const [showStockModal, setShowStockModal] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [selectedFuel, setSelectedFuel] = useState(null);
  
  // Stock history
  const [stockHistory, setStockHistory] = useState([]);

  useEffect(() => {
    loadStockData();
    loadStockHistory();
  }, []);

  const loadStockData = async () => {
    try {
      setIsLoading(true);

      // Get bunk data from localStorage
      const bunkData = JSON.parse(localStorage.getItem('bunkData') || '{}');

      // Use localStorage data (no backend call for now)
      await new Promise(resolve => setTimeout(resolve, 500));

      // Create demo stock data if none exists
      if (!bunkData.fuelAvailability) {
        bunkData.fuelAvailability = {
          petrol: { stock: 5000, price: 102.50 },
          diesel: { stock: 7000, price: 94.20 }
        };
        localStorage.setItem('bunkData', JSON.stringify(bunkData));
      }

      const formattedStockData = [
        {
          type: 'Petrol',
          currentStock: bunkData.fuelAvailability.petrol?.stock || 5000,
          capacity: 10000,
          pricePerLiter: bunkData.fuelAvailability.petrol?.price || 102.50,
          lowStockThreshold: 2000
        },
        {
          type: 'Diesel',
          currentStock: bunkData.fuelAvailability.diesel?.stock || 7000,
          capacity: 15000,
          pricePerLiter: bunkData.fuelAvailability.diesel?.price || 94.20,
          lowStockThreshold: 3000
        }
      ];

      setStockData(formattedStockData);

    } catch (error) {
      console.error('Error loading stock:', error);
      setErrorMessage('Failed to load stock data');
    } finally {
      setIsLoading(false);
    }
  };

  const loadStockHistory = async () => {
    try {
      // Mock stock history (replace with API call)
      const mockHistory = [
        {
          id: 1,
          fuelType: 'Petrol',
          action: 'Stock Added',
          quantity: 1000,
          previousStock: 4000,
          newStock: 5000,
          timestamp: new Date(Date.now() - 86400000),
          user: 'Admin'
        },
        {
          id: 2,
          fuelType: 'Diesel',
          action: 'Stock Added',
          quantity: 2000,
          previousStock: 5000,
          newStock: 7000,
          timestamp: new Date(Date.now() - 172800000),
          user: 'Admin'
        },
        {
          id: 3,
          fuelType: 'Petrol',
          action: 'Price Updated',
          oldPrice: 101.50,
          newPrice: 102.50,
          timestamp: new Date(Date.now() - 259200000),
          user: 'Admin'
        }
      ];

      setStockHistory(mockHistory);

    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const handleUpdateStock = (fuelType) => {
    const fuel = stockData.find(f => f.type === fuelType);
    setSelectedFuel(fuel);
    setShowStockModal(true);
  };

  const handleConfirmUpdateStock = async (fuelType, newStock, updateType) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update local state
      setStockData(prevData =>
        prevData.map(fuel =>
          fuel.type === fuelType
            ? { ...fuel, currentStock: newStock }
            : fuel
        )
      );

      // Update localStorage
      const bunkData = JSON.parse(localStorage.getItem('bunkData') || '{}');
      const fuelKey = fuelType.toLowerCase();
      
      if (!bunkData.fuelAvailability) {
        bunkData.fuelAvailability = { petrol: {}, diesel: {} };
      }
      
      bunkData.fuelAvailability[fuelKey].stock = newStock;
      localStorage.setItem('bunkData', JSON.stringify(bunkData));

      setSuccessMessage(`${fuelType} stock updated successfully to ${newStock}L`);
      
      // Reload history
      loadStockHistory();

    } catch (error) {
      console.error('Error updating stock:', error);
      setErrorMessage('Failed to update stock');
    }
  };

  const handleUpdatePrice = (fuelType) => {
    const fuel = stockData.find(f => f.type === fuelType);
    setSelectedFuel(fuel);
    setShowPriceModal(true);
  };

  const handleConfirmUpdatePrice = async (fuelType, newPrice, effectiveDate) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update local state
      setStockData(prevData =>
        prevData.map(fuel =>
          fuel.type === fuelType
            ? { ...fuel, pricePerLiter: newPrice }
            : fuel
        )
      );

      // Update localStorage
      const bunkData = JSON.parse(localStorage.getItem('bunkData') || '{}');
      const fuelKey = fuelType.toLowerCase();
      
      if (!bunkData.fuelAvailability) {
        bunkData.fuelAvailability = { petrol: {}, diesel: {} };
      }
      
      bunkData.fuelAvailability[fuelKey].price = newPrice;
      localStorage.setItem('bunkData', JSON.stringify(bunkData));

      setSuccessMessage(`${fuelType} price updated to ₹${newPrice}/L`);
      
      // Reload history
      loadStockHistory();

    } catch (error) {
      console.error('Error updating price:', error);
      setErrorMessage('Failed to update price');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="xl" text="Loading fuel stock..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fuel Stock Management</h1>
          <p className="text-gray-600 mt-1">Monitor and update fuel inventory</p>
        </div>
        <Button
          variant="primary"
          icon="🔄"
          onClick={loadStockData}
        >
          Refresh
        </Button>
      </div>

      {/* Messages */}
      {successMessage && (
        <Alert type="success" message={successMessage} onClose={() => setSuccessMessage('')} />
      )}
      {errorMessage && (
        <Alert type="error" message={errorMessage} onClose={() => setErrorMessage('')} />
      )}

      {/* Fuel Stock Cards */}
      <FuelStockOverview
        stockData={stockData}
        onUpdateStock={handleUpdateStock}
        onUpdatePrice={handleUpdatePrice}
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-500 w-12 h-12 rounded-xl flex items-center justify-center text-white text-2xl">
              📊
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Capacity</p>
              <p className="text-2xl font-bold text-gray-900">
                {stockData.reduce((sum, fuel) => sum + fuel.capacity, 0).toLocaleString('en-IN')}L
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-green-500 w-12 h-12 rounded-xl flex items-center justify-center text-white text-2xl">
              ⛽
            </div>
            <div>
              <p className="text-sm text-gray-600">Current Stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {stockData.reduce((sum, fuel) => sum + fuel.currentStock, 0).toLocaleString('en-IN')}L
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-orange-500 w-12 h-12 rounded-xl flex items-center justify-center text-white text-2xl">
              💰
            </div>
            <div>
              <p className="text-sm text-gray-600">Stock Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{stockData.reduce((sum, fuel) => sum + (fuel.currentStock * fuel.pricePerLiter), 0).toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stock History */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Fuel Type</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Action</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Details</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">User</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stockHistory.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(item.timestamp).toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      item.fuelType === 'Petrol' 
                        ? 'bg-orange-100 text-orange-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {item.fuelType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {item.action}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.action === 'Stock Added' && (
                      <span>+{item.quantity}L ({item.previousStock}L → {item.newStock}L)</span>
                    )}
                    {item.action === 'Price Updated' && (
                      <span>₹{item.oldPrice} → ₹{item.newPrice}/L</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.user}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {stockHistory.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-4xl mb-2">📋</p>
            <p>No activity history yet</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedFuel && (
        <>
          <UpdateStockModal
            isOpen={showStockModal}
            fuelType={selectedFuel.type}
            currentStock={selectedFuel.currentStock}
            capacity={selectedFuel.capacity}
            onClose={() => {
              setShowStockModal(false);
              setSelectedFuel(null);
            }}
            onConfirm={handleConfirmUpdateStock}
          />

          <UpdatePriceModal
            isOpen={showPriceModal}
            fuelType={selectedFuel.type}
            currentPrice={selectedFuel.pricePerLiter}
            onClose={() => {
              setShowPriceModal(false);
              setSelectedFuel(null);
            }}
            onConfirm={handleConfirmUpdatePrice}
          />
        </>
      )}

    </div>
  );
}