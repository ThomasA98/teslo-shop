import { SummaryTile } from '@/components/admin'
import { AdminLayout } from '@/components/layouts'
import { DashboardSummaryResponse } from '@/interfaces'
import AccessTimeOutlined from '@mui/icons-material/AccessTimeOutlined'
import AttachMoneyOutlined from '@mui/icons-material/AttachMoneyOutlined'
import CancelPresentationOutlined from '@mui/icons-material/CancelPresentationOutlined'
import CategoryOutlined from '@mui/icons-material/CategoryOutlined'
import CreditCardOffOutlined from '@mui/icons-material/CreditCardOffOutlined'
import CreditCardOutlined from '@mui/icons-material/CreditCardOutlined'
import DashboardOutlined from '@mui/icons-material/DashboardOutlined'
import GroupOutlined from '@mui/icons-material/GroupOutlined'
import ProductionQuantityLimitsOutlined from '@mui/icons-material/ProductionQuantityLimitsOutlined'
import { CircularProgress, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

const DashboardPage = () => {

    const { data, error, isLoading } = useSWR<DashboardSummaryResponse>('/api/admin/dashboard', {
        refreshInterval: 30_000
    });

    const [ refreshIn, setRefreshIn ] = useState(30);

    useEffect(() => {

        const interval = setInterval(() => setRefreshIn(prev => prev - 1), 1_000);

        return () => clearInterval(interval);

    }, [])

    if (isLoading && !data) return <CircularProgress />;

    if (error) return <Typography>Error al cargar la información</Typography>;

    const {
        numberOfOrders,
        paidOrders,
        notPaidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInentory
    } = data!;

    return (
        <AdminLayout
            title='Dashboard'
            subTitle='Estadisticas Generales'
            icon={<DashboardOutlined />}
        >
            <Grid container spacing={2}>
                <SummaryTile
                    title={numberOfOrders}
                    subTitle='Ordenes totales'
                    icon={<CreditCardOutlined color='secondary' sx={{ fontSize: 40 }} />}
                />

                <SummaryTile
                    title={paidOrders}
                    subTitle='Ordenes pagadas'
                    icon={<AttachMoneyOutlined color='success' sx={{ fontSize: 40 }} />}
                />

                <SummaryTile
                    title={notPaidOrders}
                    subTitle='Ordenes pendientes'
                    icon={<CreditCardOffOutlined color='error' sx={{ fontSize: 40 }} />}
                />

                <SummaryTile
                    title={numberOfClients}
                    subTitle='Clientes'
                    icon={<GroupOutlined color='primary' sx={{ fontSize: 40 }} />}
                />

                <SummaryTile
                    title={numberOfProducts}
                    subTitle='Productos'
                    icon={<CategoryOutlined color='warning' sx={{ fontSize: 40 }} />}
                />

                <SummaryTile
                    title={productsWithNoInventory}
                    subTitle='Productos sin existencias'
                    icon={<CancelPresentationOutlined color='error' sx={{ fontSize: 40 }} />}
                />

                <SummaryTile
                    title={lowInentory}
                    subTitle='Bajo inventario'
                    icon={<ProductionQuantityLimitsOutlined color='warning' sx={{ fontSize: 40 }} />}
                />

                <SummaryTile
                    title={1}
                    subTitle='Actualizacion en: '
                    icon={<AccessTimeOutlined color='secondary' sx={{ fontSize: 40 }} />}
                />
            </Grid>
        </AdminLayout>
    )
}

export default DashboardPage