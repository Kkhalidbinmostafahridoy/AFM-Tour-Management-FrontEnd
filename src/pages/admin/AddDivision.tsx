import { AddDivisionModal } from "@/components/Modules/Admin/Division/AddDivisionModal";
import { Button } from "@/components/ui/button";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { useGetDivisionTypesQuery } from "@/redux/features/division/division.api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AddDivision() {
  const { data } = useGetDivisionTypesQuery(undefined);

  return (
    <PageWrapper>
      <div className="w-full max-w-7xl mx-auto px-5">
        <div className="flex justify-between my-6 items-center">
          <h1 className="text-3xl font-bold tracking-tight">Divisions</h1>
          <Button asChild>
            <AddDivisionModal />
          </Button>
        </div>
        
        <Card className="bg-background/50 backdrop-blur-xl border-white/20 dark:border-gray-800/50 shadow-sm mt-4">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-full pl-6">Division Name</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data?.map((item: { _id: string; name: string }) => (
                  <TableRow key={item._id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="w-full pl-6 font-medium">{item.name}</TableCell>
                  </TableRow>
                ))}
                {!data?.data?.length && (
                  <TableRow>
                    <TableCell className="text-center py-8 text-muted-foreground">
                      No divisions found. Add one to get started!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
