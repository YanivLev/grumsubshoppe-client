'use client';

import { ICustomer } from '@/app/common/interfaces/customer.interface';

const fieldCls = 'block w-full px-3 h-10 border border-gray-300 rounded-md text-sm text-gray-900 bg-white outline-none focus:ring-2 focus:ring-black focus:border-black transition-shadow placeholder:text-gray-400';

interface CustomerInfoFormProps {
  value: ICustomer;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CustomerInfoForm({ value, onChange }: CustomerInfoFormProps) {
  return (
    <section>
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Customer Info</h2>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">First Name</label>
          <input type="text" name="firstName" value={value.firstName} onChange={onChange} placeholder="Jane" className={fieldCls} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Last Name</label>
          <input type="text" name="lastName" value={value.lastName} onChange={onChange} placeholder="Doe" className={fieldCls} />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-400 mb-1">Email</label>
          <input type="email" name="email" value={value.email} onChange={onChange} placeholder="jane@example.com" className={fieldCls} />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-400 mb-1">Phone</label>
          <input type="tel" name="phoneNumber" value={value.phoneNumber} onChange={onChange} placeholder="(555) 000-0000" className={fieldCls} />
        </div>
      </div>
    </section>
  );
}