import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { UserRestaurantTool } from "./UserRestaurantTool";

export enum UserRole {
  superAdmin = "super admin",
  dataEntry = "data entry",
  HR = "HR",
  Customer = "Customer"
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.dataEntry,
  })
  role: UserRole;

  @Column({ nullable: true })
  jobTitle: string;

  @Column({ type: "date", nullable: true })
  startDate: Date;

  @Column({ type: "date", nullable: true })
  endDate: Date;

  @Column({ type: "date", nullable: true })
  residencyValidity: Date;

  @Column({ type: "float", default: 0 })
  fines: number;

  @Column({ type: "float", default: 0 })
  discounts: number;

  @Column({ type: "float", default: 0 })
  loans: number;

  @Column({ type: "float", default: 0 })
  salary: number;

  @Column({ type: "int", default: 0 })
  vacationDays: number;

  @Column({ type: "int", default: 0 })
  weeklyHolidays: number;

  @Column({ type: "int", default: 0 })
  sickDays: number;

  @OneToMany(() => UserRestaurantTool, (userTool) => userTool.user)
  userRestaurantTools: UserRestaurantTool[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
