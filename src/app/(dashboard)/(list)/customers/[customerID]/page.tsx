"use client"
import React, { useEffect, useState } from 'react';
import { ArrowLeft, Mail, Phone, Building2, Calendar, Star, Clock, Edit2, Trash2, X, Save } from 'lucide-react';
import useGetCustomerDetail from '@/fetching/customer/getCustomerDetail';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import UpLoadAvatar from '@/components/UpLoadAvatar';
import { useNotification } from '@/providers/NotificationProvider';
import useUpdateCustomerDetail from '@/fetching/customer/updateCustomerDetail';
import { isValidPhoneNumber } from '@/util/phoneNumberValidation';
import { isValidEmail } from '@/util/emailValidation';
import FetchingLoadingStatus from '@/components/FetchingLoadingStatus';
import useDeleteCustomer from '@/fetching/customer/deleteCustomer';
import { moneyFormat } from '@/util/moneyFormat';
import AssignerSelectorComponent from '@/components/AssignerSelectorComponent';
import useUpdateAssigner from '@/fetching/customer/updateAssigner';

const getInitials = (name: string) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map(w => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const formatDate = (date: string) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatDateForInput = (date: string) => {
  if (!date) return "";
  return new Date(date).toISOString().split('T')[0];
};

const getDaysSince = (date?: string) => {
  if (!date) return "—";

  const diffMs = Date.now() - new Date(date).getTime();
  if (isNaN(diffMs)) return "—";

  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};


const CustomerDetail = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [customer, setCustomer] = useState<any>();
  const [editedData, setEditedData] = useState<any>({});
  const [updateAvatarFile, setAvatarFile] = useState<File>();
  const [updateAvatar, setUpdateAvatar] = useState<string>("");
  const [hasChanges, setHasChanges] = useState(false);
  const [isReassigning, setIsReassigning] = useState(false);
  const [selectedAssignerId, setSelectedAssignerId] = useState<string>("");
  const [selectedAssigner, setSelectedAssigner] = useState<any>(null);
  const [originalAssignerId, setOriginalAssignerId] = useState<string>("");



  const params = useParams();
  const customerID = params.customerID as string;
  const { loading: getCustomerDetailLoading, getCustomerDetail } = useGetCustomerDetail();
  const { loading: updateCustomerDetailLoading, updateCustomerDetail } = useUpdateCustomerDetail();
  const { loading: deleteCustomerLoading, deleteCustomer } = useDeleteCustomer();
  const { loading: updateAssignerLoading, updateAssigner } = useUpdateAssigner();
  const router = useRouter();
  const { showNotification } = useNotification();

  useEffect(() => {
    if (!customerID) return;

    const fetchData = async () => {
      try {
        const result = await getCustomerDetail(customerID);
        console.log(result);
        setCustomer(result.data);
        setEditedData({
          fullName: result.data.fullName,
          email: result.data.email,
          phoneNumber: result.data.phoneNumber,
          company: result.data.company,
          dateOfBirth: result.data.dateOfBirth,
          rating: result.data.rating,
          notes: ""
        });
        setOriginalAssignerId(result.data.assignTo.id);
        setSelectedAssignerId(result.data.assignTo.id);
        setSelectedAssigner(result.data.assignTo);
      } catch (error) {
        showNotification(String(error) || "Failed to get customer detail", true);
      }
    };

    fetchData();
  }, []);

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset edited data when canceling
      setEditedData({
        fullName: customer.fullName,
        email: customer.email,
        phoneNumber: customer.phoneNumber,
        company: customer.company,
        dateOfBirth: customer.dateOfBirth,
        rating: customer.rating,
        notes: ""
      });
    }
    setHasChanges(false);
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field: string, value: any) => {
    setEditedData((prev: any) => {
      if (prev[field] === value) return prev;

      setHasChanges(true);
      return {
        ...prev,
        [field]: value
      };
    });
  };


  const handleSave = async () => {
    try {
      if (!customerID) { return; }

      if (editedData.phoneNumber && !isValidPhoneNumber(editedData.phoneNumber)) {
        showNotification("Your update phone number is not valid", true);
        return;
      }

      if (editedData.email && !isValidEmail(editedData.email)) {
        showNotification("Your update email is not valid", true);
        return;
      }


      const result = await updateCustomerDetail(editedData, updateAvatarFile, customerID);

      if (result.code === 200) {
        setCustomer((prev: any) => ({
          ...prev,
          ...editedData
        }));

        setIsEditing(false);
        showNotification("Successfully update customer detail")
      } else {
        showNotification("Failed to update customer", true);
      }
    } catch (error) {
      showNotification(String(error) || "Failed to update customer detail", true);
    }
  };

  const handleRatingClick = (rating: number) => {
    if (isEditing) {
      handleInputChange('rating', rating);
    }
  };

  const handleDeleteCustomer = async () => {
    if (!customerID) { return; }

    try {
      const success = await deleteCustomer(customerID);

      if (success) {
        showNotification("Successfully delete customer");
        router.push("/customers/");
      }
    } catch (error) {
      showNotification(String(error) || "Processed failed", true);
    }
  }

  const handleReassignToggle = () => {
    if (isReassigning) {
      setSelectedAssignerId(originalAssignerId);
      setSelectedAssigner(customer.assignTo);
    }
    setIsReassigning(!isReassigning);
  };

  const handleAssignerChange = (assigner: any) => {
    setSelectedAssignerId(assigner?.id || "");
    setSelectedAssigner(assigner);
  };

  const handleConfirmReassign = async () => {
    if (!selectedAssignerId || selectedAssignerId === originalAssignerId) {
      showNotification("No changes to assigner", true);
      return;
    }

    try {
      const success = await updateAssigner(customerID, selectedAssignerId);

      if (success) {
        showNotification("Customer reassigned successfully");

        // Update local state with the new assigner data
        setCustomer((prev: any) => ({
          ...prev,
          assignTo: {
            ...prev.assignTo, // Keep existing properties
            ...selectedAssigner, // Override with new assigner data
            fullName: selectedAssigner.fullName,
            email: selectedAssigner.email
          }
        }));

        setOriginalAssignerId(selectedAssignerId);
        setIsReassigning(false);
      } else {
        showNotification("Failed to reassign new user", true);
      }
    } catch (error) {
      showNotification(String(error) || "Failed to reassign customer", true);
    }
  };

  if (!customer || getCustomerDetailLoading) {
    return <FetchingLoadingStatus loading={true} fullScreen={true} color="#1890ff" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header with Back Button */}
      <div className="mb-6 flex items-center justify-between">
        <button className="flex items-center text-gray-600 hover:text-gray-900 transition">
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="font-medium" onClick={() => { router.push("/customers") }}>Back to Customers</span>
        </button>
        <div className="flex gap-3">
          {isEditing ?
            updateCustomerDetailLoading ?
              <FetchingLoadingStatus loading={updateCustomerDetailLoading} color="green" size={20} />
              : (
                <>
                  <button
                    onClick={handleSave}
                    disabled={!hasChanges}
                    className={`flex items-center px-4 py-2 rounded-lg transition
                    ${hasChanges
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </button>
                  <button
                    onClick={handleEditToggle}
                    className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                </>
              ) :
            deleteCustomerLoading ?
              <FetchingLoadingStatus loading={deleteCustomerLoading} color="red" size={20} />
              : (
                <>
                  <button
                    onClick={handleEditToggle}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCustomer()}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </>
              )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center">
                <UpLoadAvatar avatar={updateAvatar || customer.avatarUrl} setAvatar={setUpdateAvatar} setAvatarFile={setAvatarFile} />
                <div className="ml-4">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="text-2xl font-bold text-gray-900 border-b-2 border-blue-500 focus:outline-none px-2 py-1"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold text-gray-900">{customer.fullName}</h1>
                  )}
                  <div className="flex items-center mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        onClick={() => handleRatingClick(i + 1)}
                        className={`w-5 h-5 ${isEditing ? 'cursor-pointer' : ''} ${i < (isEditing ? editedData.rating : customer.rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                          }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      ({isEditing ? editedData.rating : customer.rating}/5)
                    </span>
                  </div>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Active
              </span>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="text-sm font-medium text-gray-900 w-full border-b border-blue-500 focus:outline-none bg-transparent"
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-900">{customer.email}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      className="text-sm font-medium text-gray-900 w-full border-b border-blue-500 focus:outline-none bg-transparent"
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-900">{customer.phoneNumber}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Building2 className="w-5 h-5 text-purple-600 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Company</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="text-sm font-medium text-gray-900 w-full border-b border-blue-500 focus:outline-none bg-transparent"
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-900">{customer.company}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-600 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Date of Birth</p>
                  {isEditing ? (
                    <input
                      type="date"
                      value={formatDateForInput(editedData.dateOfBirth)}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className="text-sm font-medium text-gray-900 w-full border-b border-blue-500 focus:outline-none bg-transparent"
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-900">{formatDate(customer.dateOfBirth)}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Customer profile updated</p>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(customer.updatedAt)}</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Customer created</p>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(customer.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Notes</h2>
            <textarea
              value={isEditing ? editedData.notes : ""}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              disabled={!isEditing}
              className={`w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                }`}
              placeholder="Add notes about this customer..."
            ></textarea>
          </div>
        </div>

        {/* Right Column - Additional Info */}
        <div className="space-y-6">
          {/* Assigned To Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Assigned To</h2>
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-lg font-bold">
                {getInitials(customer.assignTo.fullName || `${customer.assignTo.firstName} ${customer.assignTo.lastName}`)}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {customer.assignTo.fullName || `${customer.assignTo.lastName} ${customer.assignTo.firstName}`}
                </p>
                <p className="text-xs text-gray-500">{customer.assignTo.email}</p>
              </div>
            </div>
            {isReassigning ? (
              <div className="mt-4 space-y-3">
                <AssignerSelectorComponent
                  value={selectedAssignerId}
                  onChange={handleAssignerChange}
                />
                {
                  updateAssignerLoading ?
                    <FetchingLoadingStatus loading={updateAssignerLoading} color={"green"} size={20} />
                    : (
                      <div className="flex gap-2">
                        <button
                          onClick={handleConfirmReassign}
                          disabled={selectedAssignerId === originalAssignerId}
                          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${selectedAssignerId !== originalAssignerId
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                        >
                          Confirm
                        </button>
                        <button
                          onClick={handleReassignToggle}
                          className="flex-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    )
                }
              </div>
            ) : (
              <button
                onClick={handleReassignToggle}
                className="mt-4 w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
              >
                Reassign Customer
              </button>
            )}
          </div>

          {/* Customer Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Statistics</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Orders</span>
                <span className="text-lg font-bold text-gray-900">{customer.orderStatisticInfo.totalOrders || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Spent</span>
                <span className="text-lg font-bold text-gray-900">{moneyFormat(customer.orderStatisticInfo.totalSpent || 0)}đ</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Order</span>
                <span className="text-lg font-bold text-gray-900">{moneyFormat(customer.orderStatisticInfo.averageOrder || 0)}đ</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last Order</span>
                <span className="text-sm font-medium text-gray-900">{getDaysSince(customer.orderStatisticInfo?.lastOrderAt)} days ago</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium">
                Send Email
              </button>
              <button className="w-full px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition text-sm font-medium">
                Call Customer
              </button>
              <button className="w-full px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition text-sm font-medium">
                Schedule Meeting
              </button>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Metadata</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500">Customer ID</p>
                <p className="text-gray-900 font-mono text-xs mt-1">{customer.id}</p>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-xs">Created: {formatDate(customer.createdAt)}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-xs">Updated: {formatDate(customer.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;