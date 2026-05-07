import { AppShell, Burger, Group, Title, Anchor, Menu } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet, Link } from 'react-router-dom';

export function Layout() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Anchor component={Link} to="/" underline="never" c="inherit">
              <Title order={3}>Kalenda</Title>
            </Anchor>
          </Group>
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Anchor size="sm" style={{ cursor: 'pointer' }}>
                Admin
              </Anchor>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item component={Link} to="/my">
                Event Types
              </Menu.Item>
              <Menu.Item component={Link} to="/my/bookings">
                Bookings
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
