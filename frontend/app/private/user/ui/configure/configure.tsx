"use client";

import AssetLayoutGrid from "@/assets/layout";
import SwitchConfigure from "./switch";
import CardConfigure from "./card";
import { useState } from "react";
import TableAccounts from "./accounts/table";
import TableRoles from "./roles/table";
import { AnimatePresence, motion } from "motion/react";
import FormRoles from "./roles/form";
import FormAccounts from "./accounts/form";
import {
  accountsType,
  formatsType,
  permitsType,
  queryUserType,
  rolesType,
} from "../../models/model";
import FormFormats from "./formats/form";
import TableFormats from "./formats/table";
import FormPermits from "./permits/form";
import TablePermits from "./permits/table";
import SearchConfigure from "./search";
import AssetPagination from "@/assets/pagination";

export default function Configure({
  dataAccounts,
  dataRoles,
  dataFormats,
  totalAccounts,
  totalRoles,
  totalFormats,
  dataPermits,
  totalPermits,
  keyRoles,
  keyFormats,
  keyPermits,
  querys,
}: {
  dataAccounts: accountsType[];
  dataRoles: rolesType[];
  dataFormats: formatsType[];
  totalAccounts: number;
  totalRoles: number;
  totalFormats: number;
  dataPermits: permitsType[];
  totalPermits: number;
  keyRoles: string[];
  keyFormats: string[];
  keyPermits: string[];
  querys: queryUserType;
}) {
  const [accountData, accountSet] = useState<accountsType>();
  const [roleData, roleSet] = useState<rolesType>();
  const [formatData, formatSet] = useState<formatsType>();
  const [permitData, permitSet] = useState<permitsType>();

  return (
    <AssetLayoutGrid label="Account configuration">
      <SwitchConfigure config={querys.config} />

      {/* Form edit or create user */}
      {querys.config === "roles" ? (
        <FormRoles
          actionSet={roleSet}
          actionData={roleData}
          formatKeys={keyFormats}
          permitKeys={keyPermits}
        />
      ) : querys.config === "formats" ? (
        <FormFormats actionSet={formatSet} actionData={formatData} />
      ) : querys.config === "permits" ? (
        <FormPermits actionSet={permitSet} actionData={permitData} />
      ) : (
        <FormAccounts
          actionSet={accountSet}
          actionData={accountData}
          keyRoles={keyRoles}
        />
      )}

      {/* Summary card */}
      <CardConfigure />

      {/* Search */}
      {querys.config === "roles" ? (
        <SearchConfigure
          config={"roles"}
          roleSet={roleSet}
          searchVal={querys.search}
        />
      ) : querys.config === "formats" ? (
        <SearchConfigure
          config={"formats"}
          formatSet={formatSet}
          searchVal={querys.search}
        />
      ) : querys.config === "permits" ? (
        <SearchConfigure
          config={"permits"}
          permitSet={permitSet}
          searchVal={querys.search}
        />
      ) : (
        <SearchConfigure
          config={"accounts"}
          accountSet={accountSet}
          searchVal={querys.search}
        />
      )}

      {/* Table */}
      <AnimatePresence mode="wait">
        {querys.config === "roles" ? (
          <motion.div
            key={querys.page + "roles"}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <TableRoles arrayObj={dataRoles} actionSet={roleSet} />
          </motion.div>
        ) : querys.config === "formats" ? (
          <motion.div
            key={querys.page + "formats"}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <TableFormats arrayObj={dataFormats} actionSet={formatSet} />
          </motion.div>
        ) : querys.config === "permits" ? (
          <motion.div
            key={querys.page + "permits"}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <TablePermits arrayObj={dataPermits} actionSet={permitSet} />
          </motion.div>
        ) : (
          <motion.div
            key={querys.page + "accounts"}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <TableAccounts arrayObj={dataAccounts} actionSet={accountSet} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      <AssetPagination
        currentPage={querys.page || 1}
        limit={querys.limit || 10}
        total={
          querys.config === "roles"
            ? totalRoles
            : querys.config === "formats"
              ? totalFormats
              : querys.config === "permits"
                ? totalPermits
                : totalAccounts
        }
        queryKey="page"
      />
    </AssetLayoutGrid>
  );
}
