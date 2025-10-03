'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import MembershipForm from '@/components/forms/MembershipForm';

export default function CreateTeam() {
  return (
   <div className="space-y-6">
  
        <MembershipForm/>
       </div>
   
  );
}