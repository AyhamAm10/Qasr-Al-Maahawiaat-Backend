import { AppDataSource } from "./data_source";
import { User, UserRole } from "../entity/Users";
import bcrypt from "bcrypt";
export const createSuperAdmin = async () => {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const existingSuperAdmin = await userRepository.findOne({
      where: { role: UserRole.superAdmin },
    });

    if (existingSuperAdmin) {
      console.log("Super Admin is existed");
      return;
    }

       const email = process.env.SUPERADMIN_EMAIL;
       const password = process.env.SUPERADMIN_PASSWORD;
   
       if (!email || !password) {
         throw new Error("SUPERADMIN_EMAIL or SUPERADMIN_PASSWORD is not set in environment variables");
       }
   
       const hashedPassword = await bcrypt.hash(password, 10); 
   
    const superAdmin = userRepository.create({
      username: "super admin",
      email: process.env.SUPERADMIN_EMAIL,
      password: hashedPassword,
      role: UserRole.superAdmin,
    });

    await userRepository.save(superAdmin);
    console.log("super admin creatted");
  } catch (error) {
    console.error("error when super admin created:", error);
  }
};
