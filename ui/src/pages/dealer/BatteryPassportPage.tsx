import { featuredPassportMock } from '@/mocks';
import { PageHeader } from '@/components/common/PageHeader';
import { BatteryPassportCard } from '@/components/dashboard';

/** Passport index. Only one sample passport exists until the backend lands. */
export function BatteryPassportPage() {
  return (
    <>
      <PageHeader
        title="Battery Passport"
        description="Issued battery passports for vehicles on your lots. One sample passport is available in this demo."
      />
      <div className="max-w-md">
        <BatteryPassportCard passport={featuredPassportMock} />
      </div>
    </>
  );
}
