import React from 'react';
import MainLayout from '@/components/MainLayout';
import OperatingSystemCatalog from '@/components/OperatingSystemCatalog';

export default function OperatingSystem() {
  return (
    <MainLayout title="Operating System">
      <OperatingSystemCatalog />
    </MainLayout>
  );
}