import React, { useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import { useCreateRoomBookingMutation } from '../../features/booking/roomsApi';
import { useInitializePaymentMutation } from '../../features/payments/paymentsApi';
import { useToast } from '../../contexts/ToastContext';
import Button from '../ui/Button';
import { FaTimes, FaCalendar, FaUsers, FaPhone, FaEnvelope, FaUser } from 'react-icons/fa';
import { PaymentMethod } from '../../types/payment';
import type { Room } from '../../types/room';

interface RoomBookingFormProps {
    room: Room;
    onClose: () => void;
    onSuccess?: () => void;
}

const RoomBookingForm: React.FC<RoomBookingFormProps> = ({ room, onClose, onSuccess }) => {
    const { user } = useAppSelector((state) => state.auth);
    const [createRoomBooking, { isLoading: isBooking }] = useCreateRoomBookingMutation();
    const [initializePayment, { isLoading: isInitializingPayment }] = useInitializePaymentMutation();
    const { showToast } = useToast();

    const [formData, setFormData] = useState({
        checkInDate: '',
        checkOutDate: '',
        numberOfGuests: 1,
        specialRequests: '',
        fullName: user?.name || '',
        email: user?.email || '',
        phoneNumber: '',
        paymentMethod: 'mobile_money' as PaymentMethod,
        phoneNumberForPayment: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const calculateNights = () => {
        if (!formData.checkInDate || !formData.checkOutDate) return 0;
        const start = new Date(formData.checkInDate);
        const end = new Date(formData.checkOutDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const calculateTotalPrice = () => {
        const nights = calculateNights();
        return nights * room.pricePerNight;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('DEBUG: Submitting booking with:', { roomId: room.id, userId: user?.id });

        // Basic validation
        if (!formData.checkInDate || !formData.checkOutDate) {
            showToast('Please select check-in and check-out dates', 'error');
            return;
        }

        const nights = calculateNights();
        if (nights <= 0) {
            showToast('Check-out date must be after check-in date', 'error');
            return;
        }

        const bookingTotalPrice = calculateTotalPrice();

        try {
            // Create room booking
            const bookingResult = await createRoomBooking({
                roomId: room.id, // Now a string (UUID)
                userId: user!.id,
                checkInDate: formData.checkInDate,
                checkOutDate: formData.checkOutDate,
                numberOfGuests: formData.numberOfGuests,
                totalPrice: bookingTotalPrice,
                specialRequests: formData.specialRequests || undefined,
            }).unwrap();

            // Initialize payment
            const paymentResult = await initializePayment({
                userId: user!.id,
                roomBookingId: bookingResult.id,
                amount: bookingTotalPrice,
                method: formData.paymentMethod,
                customerEmail: formData.email,
                customerName: formData.fullName,
            }).unwrap();

            if (paymentResult.data?.authorizationUrl) {
                window.location.href = paymentResult.data.authorizationUrl;
            } else {
                showToast('Booking created successfully! Please complete payment.', 'success');
                onSuccess?.();
            }

        } catch (error: any) {
            console.error('Booking failed:', error);
            showToast(error.data?.message || 'Failed to create booking', 'error');
        }
    };

    const nights = calculateNights();
    const totalPrice = calculateTotalPrice();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white dark:bg-gray-800 p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center z-10">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Book {room.name}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition">
                        <FaTimes className="text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Check-in Date</label>
                            <div className="relative">
                                <FaCalendar className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="date"
                                    name="checkInDate"
                                    value={formData.checkInDate}
                                    onChange={handleChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 dark:bg-gray-900 dark:text-white"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Check-out Date</label>
                            <div className="relative">
                                <FaCalendar className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="date"
                                    name="checkOutDate"
                                    value={formData.checkOutDate}
                                    onChange={handleChange}
                                    min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 dark:bg-gray-900 dark:text-white"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Guest Details */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Number of Guests</label>
                        <div className="relative">
                            <FaUsers className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="number"
                                name="numberOfGuests"
                                value={formData.numberOfGuests}
                                onChange={handleChange}
                                min="1"
                                max={room.capacity}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 dark:bg-gray-900 dark:text-white"
                                required
                            />
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                            <div className="relative">
                                <FaUser className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 dark:bg-gray-900 dark:text-white"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 dark:bg-gray-900 dark:text-white"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                        <div className="relative">
                            <FaPhone className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="+254..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 dark:bg-gray-900 dark:text-white"
                                required
                            />
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Payment Method</label>
                        <select
                            name="paymentMethod"
                            value={formData.paymentMethod}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 dark:bg-gray-900 dark:text-white"
                        >
                            <option value="mobile_money">M-Pesa (Mobile Money)</option>
                            <option value="card">Credit/Debit Card</option>
                        </select>
                    </div>

                    {formData.paymentMethod === 'mobile_money' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">M-Pesa Phone Number</label>
                            <div className="relative">
                                <FaPhone className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="tel"
                                    name="phoneNumberForPayment"
                                    value={formData.phoneNumberForPayment}
                                    onChange={handleChange}
                                    placeholder="254..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 dark:bg-gray-900 dark:text-white"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {/* Special Requests */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Special Requests (Optional)</label>
                        <textarea
                            name="specialRequests"
                            value={formData.specialRequests}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 dark:bg-gray-900 dark:text-white"
                        />
                    </div>

                    {/* Summary */}
                    {nights > 0 && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800">
                            <h3 className="font-bold text-amber-900 dark:text-amber-100 mb-2">
                                Booking Summary
                            </h3>
                            <div className="space-y-2">
                                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                                    <span>KSh {room.pricePerNight.toLocaleString()} × {nights} night{nights > 1 ? 's' : ''}</span>
                                    <span>KSh {totalPrice.toLocaleString()}</span>
                                </div>
                                <div className="border-t border-amber-200 dark:border-gray-600 pt-2 flex justify-between font-bold text-lg text-gray-900 dark:text-white">
                                    <span>Total</span>
                                    <span>KSh {totalPrice.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <Button
                        type="submit"
                        variant="primary"
                        disabled={isBooking || isInitializingPayment}
                        className="w-full py-3 text-lg font-bold shadow-xl shadow-amber-500/20"
                    >
                        {isBooking || isInitializingPayment ? 'Processing...' : `Pay KSh ${totalPrice.toLocaleString()}`}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default RoomBookingForm;
