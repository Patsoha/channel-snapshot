
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Header = ({ activeTab, onTabChange }: HeaderProps) => {
  return (
    <div className="glass-morphism p-4 rounded-lg mb-6">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gradient">Arizona Mobile</h1>
          <p className="text-white/70 text-sm">YouTube Channel Snapshot</p>
        </div>
        <Tabs 
          defaultValue={activeTab} 
          className="w-full md:w-auto"
          onValueChange={onTabChange}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="channels">Каналы</TabsTrigger>
            <TabsTrigger value="trending">Трендовые</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default Header;
