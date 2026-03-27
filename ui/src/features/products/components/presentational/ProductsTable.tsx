import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import type { Product } from '@/features/products/types/Product';
import { Button } from '@/shared/components/presentational/Button';

interface ProductsTableProps {
  products: Product[];
  onDelete: (id: string) => void;
}

export function ProductsTable({ products, onDelete }: ProductsTableProps) {
  const { t } = useTranslation();

  if (!products.length) {
    return <Typography>{t('products.empty')}</Typography>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('products.name')}</TableCell>
            <TableCell>{t('products.priceCents')}</TableCell>
            <TableCell align="right" />
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.priceCents}</TableCell>
              <TableCell align="right">
                <Button color="error" onClick={() => onDelete(product.id)}>
                  {t('products.delete')}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
