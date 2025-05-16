import TabsWrapper from "@/components/TabsWrapper";
import AuthWrapper from '@/components/AuthWrapper';
export const metadata = {
  title: "Trauma Board",
};
export default function HomePage() {
  
  return (
    <AuthWrapper>
      <TabsWrapper />
    </AuthWrapper>
  );
}
