// import { AddDivisionModal } from "@/components/Modules/Admin/Division/AddDivisionModal";

// function AddDivision() {
//   return (
//     <div className="division mx-auto border-x-8  items-center justify-center w-full">
//       <h2 className="text-3xl px-[400px]">This is Division Component</h2>
//       <p className="text-xl px-[520px]">Added Division</p>
//       <AddDivisionModal />
//     </div>
//   );
// }

// export default AddDivision;

import { RadioGroup } from "@/components/ui/radio-group";
import { AddDivisionModal } from "@/components/Modules/Admin/Division/AddDivisionModal";
import { Button } from "@/components/ui/button";

export default function AddDivision() {
  return (
    <RadioGroup className="grid-cols-3 mx-auto" defaultValue="1">
      {/* Credit card */}
      <div className="border-input has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer flex-col items-center gap-3 rounded-md border px-2 py-3 text-center shadow-2xl transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px]">
        <div className="division mx-auto border-x-4  items-center justify-center w-full">
          <h2 className="text-3xl mt-2 mb-2 text-purple-600 underline">
            This is Division Component
          </h2>
          <Button>
            <AddDivisionModal />
          </Button>
        </div>
      </div>
    </RadioGroup>
  );
}
