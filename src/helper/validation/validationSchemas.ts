import * as Yup from "yup";
import { UserRole } from "../../entity/Users";

export const userSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  role: Yup.mixed<UserRole>()
    .oneOf(Object.values(UserRole), "Invalid role")
    .required("Role is required"),
  email: Yup.lazy((value, { parent }) =>
    parent.role !== UserRole.Customer
      ? Yup.string().email("Invalid email").required("Email is required")
      : Yup.string().notRequired()
  ),
  password: Yup.lazy((value, { parent }) =>
    parent.role !== UserRole.Customer
      ? Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required")
      : Yup.string().notRequired()
  ),
  isActive: Yup.boolean(),
  jobTitle: Yup.string().nullable(),
  startDate: Yup.date().nullable(),
  endDate: Yup.date().nullable(),
  residencyValidity: Yup.date().nullable(),
  fines: Yup.number().min(0).default(0),
  discounts: Yup.number().min(0).default(0),
  loans: Yup.number().min(0).default(0),
  salary: Yup.number().min(0).default(0),
  vacationDays: Yup.number().min(0).default(0),
  weeklyHolidays: Yup.number().min(0).default(0),
  sickDays: Yup.number().min(0).default(0),
});

export const productSchema = Yup.object({
  name: Yup.string().required("Product name is required"),
  details: Yup.string().required("Product details are required"),
  base_price: Yup.number()
    .required("Base price is required")
    .min(0, "Base price must be a positive number"),
  offer_price: Yup.number()
    .nullable()
    .min(0, "Offer price must be a positive number")
    .when("base_price", (base_price, schema) => {
      return typeof base_price === "number"
        ? schema.test(
            "is-less-than-base-price",
            "Offer price must be less than base price",
            function (offer_price) {
              if (offer_price == null) return true;
              return offer_price < base_price;
            }
          )
        : schema;
    }),

  category_id: Yup.number()
    .nullable()
    .integer("Category ID must be an integer"),
  productData: Yup.array()
    .of(
      Yup.object({
        variation_id: Yup.number()
          .required("Variation ID is required")
          .integer("Variation ID must be an integer"),
        price_For_variation: Yup.number()
          .required("Price for variation is required")
          .min(0, "Price for variation must be a positive number"),
        offer_for_variation: Yup.number()
          .nullable()
          .min(0, "Offer for variation must be a positive number"),
      })
    )
    .nullable(),
});

export const productDataSchema = Yup.object({
  image: Yup.string()
    .required("Image path is required")
    .test(
      "is-valid-path",
      "Invalid image path",
      (value) => !!value && value.trim() !== ""
    ),
  price_For_variation: Yup.number()
    .required("Price for variation is required")
    .min(0, "Price for variation must be a positive number"),
  offer_for_variation: Yup.number()
    .nullable()
    .min(0, "Offer for variation must be a positive number"),
  variation_id: Yup.number()
    .required("Variation ID is required")
    .integer("Variation ID must be an integer"),
});

export const validateProduct = async (productData: any) => {
  try {
    await productSchema.validate(productData, { abortEarly: false });
    console.log("Validation passed!");
  } catch (validationErrors) {
    console.error("Validation failed:", validationErrors.errors);
  }
};


export const orderValidatorSchema = Yup.object({
  delivery_fee: Yup.number()
    .typeError("Delivery fee must be a number")
    .min(0, "Delivery fee cannot be negative")
    .required("Delivery fee is required"),

  valet: Yup.number()
    .typeError("Valet must be a number")
    .min(0, "Valet cannot be negative")
    .required("Valet is required"),

  subtotal: Yup.number()
    .typeError("Subtotal must be a number")
    .min(0, "Subtotal cannot be negative")
    .required("Subtotal is required"),

  total: Yup.number()
    .typeError("Total must be a number")
    .min(0, "Total cannot be negative")
    .required("Total is required"),

  order_type: Yup.mixed()
    .oneOf(["delivery", "takeaway", "dine_in"], "Invalid order type order type most be delivery, takeaway or dine_in ")
    .required("Order type is required"),

  table_number: Yup.number()
    .nullable()
    .typeError("Table number must be a number")
    .min(1, "Table number must be greater than 0"),

  lat: Yup.number()
    .nullable()
    .typeError("Latitude must be a number")
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90"),

  long: Yup.number()
    .nullable()
    .typeError("Longitude must be a number")
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180"),

  phone_number: Yup.string()
    .nullable()
    .matches(/^\d{10,15}$/, "Phone number must be between 10 and 15 digits"),

  take_away_time: Yup.string()
    .nullable()
    .matches(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "Take-away time must be in HH:mm format"
    ),

  street_address: Yup.string()
    .nullable()
    .max(255, "Street address cannot exceed 255 characters"),

  building_name: Yup.string()
    .nullable()
    .max(255, "Building name cannot exceed 255 characters"),

  apartment_number: Yup.string()
    .nullable()
    .max(50, "Apartment number cannot exceed 50 characters"),

  products: Yup.array()
    .of(
      Yup.object().shape({
        product: Yup.number()
          .typeError("Product ID must be a number")
          .required("Product is required"),
        variation: Yup.number()
          .nullable()
          .typeError("Variation ID must be a number"),
        product_count: Yup.number()
          .typeError("Product count must be a number")
          .min(1, "Product count must be at least 1")
          .required("Product count is required"),
        product_price: Yup.number()
          .typeError("Product price must be a number")
          .min(0, "Product price cannot be negative")
          .required("Product price is required"),
      })
    )
    .min(1, "At least one product is required")
    .required("Products are required"),
});
