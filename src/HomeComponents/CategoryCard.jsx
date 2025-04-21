import {
  CreditCard,
  CircleDollarSign,
  Carrot,
  Home as House,
  Smartphone,
  Clapperboard,
  ShoppingBag,
  Coffee,
  Utensils,
  Car,
  DollarSign,
  Briefcase,
  Activity,
  Heart,
  Droplet,
  Wifi,
  LifeBuoy,
} from "lucide-react";
import { useContext } from "react";
import MyContext from "../Context";
import { getCurrencySymbol } from "../currencyUtils";

export const CategoryCard = ({
  category,
  total,
  percentage,
  color,
  activeType,
  currency,
}) => {
  // Map category names to appropriate icons

  const getCategoryIcon = (category) => {
    // Map category names to Lucide icon components and colors
    const categoryMap = {
      // Income categories
      salary: { Icon: Briefcase, color: "#4CAF50" },
      investment: { Icon: DollarSign, color: "#8BC34A" },
      bonus: { Icon: CircleDollarSign, color: "#CDDC39" },
      "other income": { Icon: DollarSign, color: "#A5D6A7" },

      // Expense categories
      groceries: { Icon: Carrot, color: "#f44336" },
      home: { Icon: House, color: "#f97316" },
      housing: { Icon: House, color: "#FFC107" },
      electronics: { Icon: Smartphone, color: "#2196f3" },
      entertainment: { Icon: Clapperboard, color: "#9c27b0" },
      food: { Icon: Utensils, color: "#FF9800" },
      coffee: { Icon: Coffee, color: "#795548" },
      shopping: { Icon: ShoppingBag, color: "#E91E63" },
      transportation: { Icon: Car, color: "#3F51B5" },
      health: { Icon: Heart, color: "#F06292" },
      utilities: { Icon: Droplet, color: "#03A9F4" },
      internet: { Icon: Wifi, color: "#00BCD4" },
      insurance: { Icon: LifeBuoy, color: "#607D8B" },
      fitness: { Icon: Activity, color: "#FF5722" },
    };

    // If category is not found in the map, return a default icon
    return (
      categoryMap[category?.toLowerCase()] || {
        Icon: CreditCard,
        color: "#9e9e9e",
      }
    );
  };

  const { Icon, color: iconColor } = getCategoryIcon(category);

  return (
    <div className="px-4 border-b-[1px] py-2 h-fit  ">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <div
            className="relative inline-flex flex-shrink-0 items-center justify-center w-10 h-10 rounded-full mr-2"
            style={{
              backgroundColor: color,
            }}
          >
            {/* Render the Icon component with proper sizing */}
            <Icon className="size-6 text-white " />
          </div>
          <div>
            <h3 className="font-medium text-gray-800 text-lg">
              {category.charAt(0).toUpperCase() +
                category.slice(1).toLowerCase()}
            </h3>
          </div>
        </div>
        <div className="text-right flex gap-3">
          <p
            className={`text-lg font-medium ${
              activeType === "expense" ? "text-red-500" : "text-green-500"
            }`}
          >
            {currency}{total.toLocaleString()}
          </p>
          <p className="text-lg font-medium">{percentage}%</p>
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className="h-1.5 rounded-full"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        ></div>
      </div>
    </div>
  );
};
