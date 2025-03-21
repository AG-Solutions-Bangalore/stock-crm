import React from "react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import BASE_URL from "@/config/BaseUrl";
import { Loader2, SquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLocation } from "react-router-dom";
import { ButtonConfig } from "@/config/ButtonConfig";
import { BUYER_CREATE } from "@/api";

const CreateBuyer = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    buyer_name: "",
    buyer_city: "",
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { pathname } = useLocation();
  const handleSubmit = async () => {
    const missingFields = [];
    if (!formData.buyer_name) missingFields.push("Buyer Name");
    if (!formData.buyer_city) missingFields.push("Buyer City");
    if (missingFields.length > 0) {
      toast({
        title: "Validation Error",
        description: (
          <div>
            <p>Please fill in the following fields:</p>
            <ul className="list-disc pl-5">
              {missingFields.map((field, index) => (
                <li key={index}>{field}</li>
              ))}
            </ul>
          </div>
        ),
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${BUYER_CREATE}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response?.data.code == 200) {
        toast({
          title: "Success",
          description: response.data.msg,
        });

        setFormData({
          state_name: "",
          state_no: "",
        });
        await queryClient.invalidateQueries(["buyers"]);
        setOpen(false);
      } else {
        toast({
          title: "Error",
          description: response.data.msg,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create Buyer",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {pathname === "/master/buyer" ? (

          <div>
            <div className="sm:hidden">
              <Button
                variant="default"
                className={`md:ml-2 bg-yellow-400 hover:bg-yellow-600 text-black rounded-l-full`}
              >
                <SquarePlus className="h-4 w-4" /> Buyer
              </Button>
            </div>
            <div className="hidden sm:block">
              <Button
                variant="default"
                className={`md:ml-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
              >
                <SquarePlus className="h-4 w-4 mr-2" /> Buyer
              </Button>
            </div>
          </div>
        ) : pathname === "/purchase/create" ||
          pathname === "/dispatch/create" ||
          "/purchase/edit" ? (
          <p className="text-xs text-red-600  w-32 hover:text-red-300 cursor-pointer">
            Buyer <span className="text-red-500 ml-1">*</span>
          </p>
        ) : (
          <span />
        )}
      </PopoverTrigger>
      <PopoverContent className="md:w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Create New Buyer</h4>
            <p className="text-sm text-muted-foreground">
              Enter the details for the new Buyer
            </p>
          </div>
          <div className="grid gap-2">
            <Input
              id="buyer_name"
              placeholder="Enter Buyer Name"
              value={formData.buyer_name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, buyer_name: e.target.value }))
              }
            />
            <Input
              id="buyer_city"
              placeholder="Enter Buyer City"
              value={formData.buyer_city}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, buyer_city: e.target.value }))
              }
            />
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`mt-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Buyer"
              )}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CreateBuyer;
