import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/modules/auth/guards/auth.guard";
import { SupplierAuthGuard } from "src/modules/supplier/guards/supplier-auth.guard";

export function UserAuth() {
    return applyDecorators(
        UseGuards(AuthGuard)
    )
}
export function SupplierAuth() {
    return applyDecorators(
        UseGuards(SupplierAuthGuard)
    )
}