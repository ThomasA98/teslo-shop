import { tesloApi } from "@/api";
import { AdminLayout } from "@/components/layouts"
import { IUser } from "@/interfaces";
import { PeopleOutline } from "@mui/icons-material";
import { CircularProgress, MenuItem, Select } from "@mui/material";
import Grid from "@mui/material/Grid";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import useSWR from 'swr';

const UsersPage: NextPage = () =>  {

    const { data, error } = useSWR<IUser[]>('/api/admin/users');
    const [ users, setUsers ] = useState<IUser[]>([]);

    useEffect(() => {
        if (data) setUsers(data);
    }, [ data ])

    if (!data && !error) return <CircularProgress />

    const onRoleUpdated = async (userId: string, newRole: string) => {

        const previosUsers = users.map(user => ({ ...user }));
        const updatedUsers = users.map(user => ({
            ...user,
            role: userId === user._id ? newRole : user.role
        }));

        setUsers(updatedUsers);

        try {
            const {  } = await tesloApi.put('/admin/users', {
                userId,
                role: newRole
            });
        } catch (error) {
            setUsers(previosUsers);
            alert('No se pudo actualizar el role del usuario');
        }

    }

    const columns: GridColDef[] = [
        { field: 'email', headerName: 'Correo', width: 250 },
        { field: 'name', headerName: 'Nombre completo', width: 300 },
        {
            field: 'role',
            headerName: 'Role',
            width: 300,
            renderCell: ({ row }) => {
                return <Select
                        value={ row.role }
                        label='Rol'
                        onChange={ ({ target }) => onRoleUpdated(row.id, target.value) }
                        sx={{ width: '300px' }}
                    >
                        <MenuItem value='client' >Client</MenuItem>
                        <MenuItem value='admin' >Admin</MenuItem>
                    </Select>
            }
        },
    ];

    const rows = users!.map( user => ({
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
    }));

  return (
    <AdminLayout
        title="Usuarios"
        subTitle="Mantenimiento de usuarios"
        icon={ <PeopleOutline /> }
    >
        <Grid container >
            <Grid item xs={ 12 } sx={{ height: 650, width: '100%' }}>
              <DataGrid
                rows={ rows }
                columns={ columns }
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 10 }
                  }
                }}
                pageSizeOptions={ [10] }
              />
            </Grid>
        </Grid>
    </AdminLayout>
  )
}


export default UsersPage;