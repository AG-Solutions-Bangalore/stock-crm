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
import { CATEGORY_CREATE } from "@/api";

const CreateCategory = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { pathname } = useLocation();
  const handleSubmit = async () => {
    const missingFields = [];
    if (!formData.category) missingFields.push("Category");
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
      const response = await axios.post(`${CATEGORY_CREATE}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response?.data.code == 200) {
        toast({
          title: "Success",
          description: response.data.msg,
        });

        setFormData({
          category: "",
        });
        await queryClient.invalidateQueries(["category"]);
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
        description:
          error.response?.data?.message || "Failed to create product",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      {" "}
      <PopoverTrigger asChild>
        {pathname === "/master/category" ? (
          <div>
          <div className="sm:hidden">
          <Button
            variant="default"
            className={`md:ml-2 bg-yellow-400 hover:bg-yellow-600 text-black rounded-l-full`}
          >
            <SquarePlus className="h-4 w-4" /> Category
          </Button>
          </div>
          <div className="hidden sm:block">
          <Button
            variant="default"
            className={`md:ml-2 w-full ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
          >
            <SquarePlus className="h-4 w-4 mr-2" /> Category
          </Button>
          </div>
          </div>
        ) : pathname === "/purchase/create" ||
          pathname === "/dispatch/create" ? (
          <p className="text-xs text-red-600  w-32 hover:text-red-300 cursor-pointer">
            Category
          </p>
        ) : (
          <span />
        )}
      </PopoverTrigger>
      <PopoverContent className="md:w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Create New Category</h4>
            <p className="text-sm text-muted-foreground">
              Enter the details for the new Category
            </p>
          </div>
          <div className="grid gap-2">
            <Input
              id="category"
              placeholder="Enter category name"
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
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
                "Create Category"
              )}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CreateCategory;
