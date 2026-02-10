"use client";

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

import { formatCurrency } from "@app/shared/lib/format";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface InvoiceItemsTableProps {
  items: InvoiceItem[];
  currency: string;
}

export function InvoiceItemsTable({ items, currency }: InvoiceItemsTableProps) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
            <TableCell align="right" sx={{ fontWeight: 600 }}>
              Qty
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: 600 }}>
              Unit Price
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: 600 }}>
              Amount
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} sx={{ "&:last-child td": { border: 0 } }}>
              <TableCell>{item.description}</TableCell>
              <TableCell align="right">{item.quantity}</TableCell>
              <TableCell align="right">{formatCurrency(item.unitPrice, currency)}</TableCell>
              <TableCell align="right" sx={{ fontWeight: 500 }}>
                {formatCurrency(item.amount, currency)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
