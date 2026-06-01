import {
  ActionIcon,
  Box,
  Button,
  Group,
  Modal,
  PasswordInput,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { AtSign, LockKeyhole, Plane, Sparkles, UserRound, X } from "lucide-react";
import { useAuth } from "./provider";

export default function AuthPopover() {
  const { form, errors, opened, setOpened, isLogin, loading, updateField, submit, toggleMode, handleModeChange } =
    useAuth();

  const mode = isLogin ? "login" : "register";

  return (
    <>
      <Button
        radius="xl"
        size="md"
        leftSection={<UserRound size={17} />}
        onClick={() => setOpened(true)}
        style={{
          background: "linear-gradient(135deg, #2563eb 0%, #0f766e 58%, #14b8a6 100%)",
          boxShadow: "0 12px 28px rgba(15, 118, 110, 0.24)",
        }}
      >
        Login / Sign up
      </Button>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        centered
        radius="lg"
        size="md"
        padding={0}
        withCloseButton={false}
        overlayProps={{
          backgroundOpacity: 0.45,
          blur: 6,
        }}
        styles={{
          content: {
            overflow: "hidden",
            boxShadow: "0 30px 80px rgba(15, 23, 42, 0.28)",
          },
        }}
      >
        <Box
          style={{
            background: "linear-gradient(135deg, #102a43 0%, #155e75 54%, #0f766e 100%)",
            color: "#ffffff",
            padding: "28px 28px 26px",
            position: "relative",
          }}
        >
          <Group justify="space-between" align="flex-start" wrap="nowrap">
            <Stack gap={6}>
              <ThemeIcon size={42} radius="xl" variant="white" color="teal">
                <Plane size={22} />
              </ThemeIcon>
              <Title order={2} fz={30} lh={1.05}>
                {isLogin ? "Welcome back" : "Start your journey"}
              </Title>
              <Text c="cyan.0" size="sm">
                {isLogin
                  ? "Sign in to keep planning your perfect stay."
                  : "Create an account and save trips in one place."}
              </Text>
            </Stack>

            <ThemeIcon
              size={36}
              radius="xl"
              variant="light"
              color="cyan"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.16)" }}
            >
              <Sparkles size={18} />
            </ThemeIcon>
          </Group>

          <ActionIcon
            aria-label="Close auth dialog"
            variant="subtle"
            color="gray"
            radius="xl"
            onClick={() => setOpened(false)}
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              color: "#ffffff",
              backgroundColor: "rgba(255, 255, 255, 0.14)",
            }}
          >
            <X size={18} />
          </ActionIcon>
        </Box>

        <Stack gap="md" p={{ base: "md", sm: "xl" }}>
          <SegmentedControl
            fullWidth
            radius="xl"
            value={mode}
            onChange={handleModeChange}
            data={[
              { value: "login", label: "Login" },
              { value: "register", label: "Sign up" },
            ]}
          />

          {!isLogin && (
            <TextInput
              label="Name"
              placeholder="Your name"
              size="md"
              radius="md"
              leftSection={<UserRound size={17} />}
              value={form.username}
              error={errors.username}
              onChange={(e) => updateField("username", e.target.value)}
            />
          )}

          <TextInput
            label="Email"
            placeholder="you@example.com"
            size="md"
            radius="md"
            leftSection={<AtSign size={17} />}
            value={form.email}
            error={errors.email}
            onChange={(e) => updateField("email", e.target.value)}
          />

          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            size="md"
            radius="md"
            leftSection={<LockKeyhole size={17} />}
            value={form.password}
            error={errors.password}
            onChange={(e) => updateField("password", e.target.value)}
          />

          <Button
            loading={loading}
            onClick={submit}
            size="md"
            radius="xl"
            fullWidth
            style={{
              background: "linear-gradient(135deg, #2563eb 0%, #0f766e 68%, #14b8a6 100%)",
              boxShadow: "0 14px 30px rgba(37, 99, 235, 0.22)",
            }}
          >
            {isLogin ? "Login to TripEase" : "Create account"}
          </Button>

          <Button variant="subtle" radius="xl" onClick={toggleMode}>
            {isLogin ? "New here? Create an account" : "Already have an account? Login"}
          </Button>
        </Stack>
      </Modal>
    </>
  );
}
