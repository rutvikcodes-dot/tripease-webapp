import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Group,
  Loader,
  Paper,
  RingProgress,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Textarea,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { Bot, CheckCircle2, Clock3, Hotel, Search, SlidersHorizontal, Sparkles, UserRound } from "lucide-react";
import { AI_CONSTANTS } from "../../utils/constants";
import { AiSearchProvider, useAiSearch } from "./provider";
import AiFilterChips from "./components/AiFilterChips";
import AiHotelCard from "./components/AiHotelCard";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80";

const surfaceStyle = {
  border: "1px solid rgba(255, 255, 255, 0.72)",
  boxShadow: "0 24px 70px rgba(31, 41, 55, 0.14)",
};

const AiHotelSearchContent = () => {
  const {
    searchCopy,
    examplePrompts,
    message,
    setMessage,
    submittedMessage,
    summary,
    filtersApplied,
    tips,
    loading,
    submitSearch,
    runExample,
    hasSearched,
    isUnsupported,
    hasHotels,
    hasRecommendedHotels,
    hasFilters,
    matchCount,
    resultSubtitle,
    resultsState,
    hotelCards,
    recommendedHotelCards,
  } = useAiSearch();

  return (
    <Box
      style={{
        flex: 1,
        background:
          "linear-gradient(135deg, #fff7ed 0%, #f8fafc 35%, #ecfeff 70%, #fdf2f8 100%)",
        minHeight: "100vh",
      }}
    >
      <Container size="xl" py={{ base: 22, md: 38 }} style={{ width: "100%" }}>
        <Stack gap={28}>
          <Paper
            radius={24}
            p={{ base: "md", md: 28 }}
            style={{
              ...surfaceStyle,
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.92), rgba(255, 251, 235, 0.86) 42%, rgba(236, 254, 255, 0.9))",
              backdropFilter: "blur(18px)",
              overflow: "hidden",
            }}
          >
            <Grid align="stretch" gutter={{ base: "lg", md: 28 }}>
              <Grid.Col span={{ base: 12, md: 5 }}>
                <Stack
                  gap="md"
                  justify="space-between"
                  style={{
                    minHeight: "100%",
                    position: "relative",
                  }}
                >
                  <Group gap="xs">
                    <Badge
                      variant="gradient"
                      gradient={{ from: "orange", to: "pink", deg: 100 }}
                      size="lg"
                      radius="xl"
                      leftSection={<Sparkles size={14} />}
                      style={{
                        width: "fit-content",
                        boxShadow: "0 10px 26px rgba(236, 72, 153, 0.2)",
                      }}
                    >
                      {searchCopy.badge}
                    </Badge>
                    <Badge
                      variant="white"
                      color="teal"
                      radius="xl"
                      style={{ border: "1px solid rgba(20, 184, 166, 0.22)" }}
                    >
                      {searchCopy.modeBadge}
                    </Badge>
                  </Group>

                  <Title
                    order={1}
                    style={{
                      color: "#111827",
                      fontSize: "clamp(2.25rem, 4vw, 4.25rem)",
                      fontWeight: 950,
                      lineHeight: 0.98,
                      maxWidth: 520,
                    }}
                  >
                    {searchCopy.title}
                  </Title>

                  <Text size="lg" maw={520} style={{ color: "#475569", lineHeight: 1.75 }}>
                    {searchCopy.subtitle}
                  </Text>

                  <Paper
                    radius={22}
                    p="xs"
                    style={{
                      backgroundImage: `linear-gradient(90deg, rgba(17, 24, 39, 0.72), rgba(17, 24, 39, 0.16)), url(${HERO_IMAGE})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      minHeight: 132,
                      display: "flex",
                      alignItems: "flex-end",
                      border: "1px solid rgba(255, 255, 255, 0.55)",
                      boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.25)",
                    }}
                  >
                    <Group gap="xs" p="sm">
                      <Badge variant="white" color="orange" radius="xl">
                        curated stays
                      </Badge>
                      <Badge variant="white" color="teal" radius="xl">
                        smart budgets
                      </Badge>
                    </Group>
                  </Paper>

                  <Group gap="sm" mt="xs" align="center">
                    <RingProgress
                      size={64}
                      thickness={6}
                      roundCaps
                      sections={[
                        { value: 42, color: "orange" },
                        { value: 34, color: "teal" },
                        { value: 24, color: "pink" },
                      ]}
                      label={
                        <ThemeIcon size={32} radius="xl" variant="white" color="orange">
                          <Bot size={15} />
                        </ThemeIcon>
                      }
                    />
                    <Badge variant="white" color="orange" radius="xl" leftSection={<CheckCircle2 size={13} />}>
                      {AI_CONSTANTS.FEATURE_BADGES[0]}
                    </Badge>
                    <Badge variant="white" color="cyan" radius="xl" leftSection={<Hotel size={13} />}>
                      {AI_CONSTANTS.FEATURE_BADGES[1]}
                    </Badge>
                    <Badge variant="white" color="pink" radius="xl" leftSection={<SlidersHorizontal size={13} />}>
                      {AI_CONSTANTS.FEATURE_BADGES[2]}
                    </Badge>
                  </Group>
                </Stack>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 7 }}>
                <Paper
                  radius={22}
                  p={{ base: "md", md: 20 }}
                  style={{
                    height: "100%",
                    background: "rgba(255, 255, 255, 0.9)",
                    border: "1px solid rgba(255, 255, 255, 0.82)",
                    boxShadow: "0 22px 50px rgba(15, 23, 42, 0.12)",
                  }}
                >
                  <form onSubmit={submitSearch}>
                    <Stack gap="md">
                      <Group justify="space-between" align="center">
                        <Group gap="xs">
                          <ThemeIcon
                            variant="gradient"
                            gradient={{ from: "orange", to: "pink", deg: 120 }}
                            radius="xl"
                            size={40}
                          >
                            <Bot size={18} />
                          </ThemeIcon>
                          <div>
                            <Text fw={900} size="lg" style={{ color: "#111827" }}>
                              {searchCopy.formTitle}
                            </Text>
                            <Text size="xs" c="dimmed">
                              Ask like you would text a travel concierge.
                            </Text>
                          </div>
                        </Group>
                        {loading && (
                          <Group gap={7}>
                            <Loader size="xs" color="orange" />
                            <Text size="sm" fw={700} c="orange">
                              {searchCopy.loadingStatus}
                            </Text>
                          </Group>
                        )}
                      </Group>

                      {(hasSearched || loading) && (
                        <Stack
                          gap="sm"
                          p="sm"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(255, 247, 237, 0.78), rgba(236, 254, 255, 0.72))",
                            border: "1px solid rgba(251, 146, 60, 0.18)",
                            borderRadius: 18,
                          }}
                        >
                          {submittedMessage && (
                            <Group justify="flex-end" align="flex-start" wrap="nowrap">
                              <Paper
                                radius="md"
                                px="md"
                                py="sm"
                                style={{
                                  maxWidth: "82%",
                                  background: "linear-gradient(135deg, #f97316, #db2777)",
                                  color: "#ffffff",
                                  boxShadow: "0 12px 28px rgba(219, 39, 119, 0.18)",
                                }}
                              >
                                <Text size="sm" fw={600}>
                                  {submittedMessage}
                                </Text>
                              </Paper>
                              <ThemeIcon color="orange" radius="xl" size="sm">
                                <UserRound size={14} />
                              </ThemeIcon>
                            </Group>
                          )}

                          {summary && (
                            <Group align="flex-start" wrap="nowrap">
                              <ThemeIcon variant="light" color={isUnsupported ? "gray" : "orange"} radius="xl" size="sm">
                                <Bot size={14} />
                              </ThemeIcon>
                              <Paper
                                radius="md"
                                px="md"
                                py="sm"
                                style={{
                                  maxWidth: "82%",
                                  backgroundColor: isUnsupported ? "#f8fafc" : "#fff7ed",
                                  border: "1px solid rgba(251, 146, 60, 0.16)",
                                }}
                              >
                                <Text size="sm" c={isUnsupported ? "dark" : "orange"} fw={700}>
                                  {summary}
                                </Text>
                                {!isUnsupported && <AiFilterChips filters={filtersApplied} />}
                              </Paper>
                            </Group>
                          )}

                          {loading && (
                            <Group align="flex-start" wrap="nowrap">
                              <ThemeIcon variant="light" color="orange" radius="xl" size="sm">
                                <Bot size={14} />
                              </ThemeIcon>
                              <Paper
                                radius="md"
                                px="md"
                                py="sm"
                                style={{
                                  maxWidth: "82%",
                                  backgroundColor: "#fff7ed",
                                  border: "1px solid rgba(251, 146, 60, 0.16)",
                                }}
                              >
                                <Group gap="xs">
                                  <Loader size="xs" color="orange" />
                                  <Text size="sm" c="orange" fw={700}>
                                    {searchCopy.assistantLoading}
                                  </Text>
                                </Group>
                              </Paper>
                            </Group>
                          )}
                        </Stack>
                      )}

                      <Paper
                        radius={18}
                        p="md"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(255, 247, 237, 0.92), rgba(240, 253, 250, 0.88))",
                          border: "1px solid rgba(251, 146, 60, 0.24)",
                          boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.7)",
                        }}
                      >
                        <Stack gap="xs">
                          <Group justify="space-between" align="center">
                            <div>
                              <Text size="xs" tt="uppercase" fw={900} c="orange">
                                {searchCopy.promptLabel}
                              </Text>
                              <Text size="xs" c="dimmed">
                                {searchCopy.promptHelper}
                              </Text>
                            </div>
                            <Badge variant="white" color="teal" radius="xl">
                              {searchCopy.promptCapabilityBadge}
                            </Badge>
                          </Group>

                          <Textarea
                            autosize
                            minRows={3}
                            maxRows={6}
                            radius="md"
                            value={message}
                            onChange={(event) => setMessage(event.currentTarget.value)}
                            placeholder={searchCopy.textareaPlaceholder}
                            disabled={loading}
                            styles={{
                              input: {
                                fontSize: 15,
                                lineHeight: 1.65,
                                borderColor: "rgba(251, 146, 60, 0.38)",
                                backgroundColor: "rgba(255, 255, 255, 0.96)",
                                boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.85)",
                              },
                            }}
                          />
                        </Stack>
                      </Paper>

                      <Group justify="space-between" align="flex-end" gap="md">
                        <Stack gap={6} style={{ flex: 1 }}>
                          <Text size="xs" tt="uppercase" fw={900} c="gray.7">
                            {searchCopy.examplesLabel}
                          </Text>
                          <Group gap="xs">
                            {examplePrompts.map((example) => (
                            <Button
                              key={example.prompt}
                              type="button"
                              variant="white"
                              color="orange"
                              size="xs"
                              radius="md"
                              title={example.prompt}
                              onClick={() => runExample(example.prompt)}
                              disabled={loading}
                              styles={{
                                root: {
                                  height: "auto",
                                  paddingTop: 9,
                                  paddingBottom: 9,
                                  border: "1px solid rgba(251, 146, 60, 0.18)",
                                  boxShadow: "0 8px 18px rgba(15, 23, 42, 0.05)",
                                },
                                label: {
                                  flexDirection: "column",
                                  alignItems: "flex-start",
                                  gap: 2,
                                },
                              }}
                            >
                              <Text span size="xs" fw={800}>
                                {example.label}
                              </Text>
                              <Text span size="xs" c="dimmed" fw={500}>
                                {example.description}
                              </Text>
                            </Button>
                          ))}
                          </Group>
                        </Stack>

                        <Button
                          type="submit"
                          radius="xl"
                          size="md"
                          leftSection={<Search size={16} />}
                          loading={loading}
                          variant="gradient"
                          gradient={{ from: "orange", to: "pink", deg: 120 }}
                          style={{ boxShadow: "0 14px 26px rgba(219, 39, 119, 0.2)" }}
                        >
                          {searchCopy.submitLabel}
                        </Button>
                      </Group>
                    </Stack>
                  </form>
                </Paper>
              </Grid.Col>
            </Grid>
          </Paper>

          {hasRecommendedHotels && (
            <Stack gap="md">
              <Group justify="space-between">
                <div>
                  <Title order={3} style={{ color: "#111827" }}>{searchCopy.recommendedTitle}</Title>
                  <Text size="sm" c="dimmed">
                    {searchCopy.recommendedSubtitle}
                  </Text>
                </div>
              </Group>

              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
                {recommendedHotelCards.map((card) => (
                  <AiHotelCard
                    key={card.key}
                    card={card}
                    compact
                  />
                ))}
              </SimpleGrid>
            </Stack>
          )}

          <Grid align="flex-start" gutter="lg">
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Stack gap="md">
                <div>
                  <Title order={3} style={{ color: "#111827" }}>{searchCopy.filtersTitle}</Title>
                  <Text size="sm" c="dimmed">
                    {loading ? searchCopy.filtersLoading : hasFilters ? `${matchCount} ${searchCopy.matchesSuffix}` : searchCopy.filtersEmpty}
                  </Text>
                </div>

                <Paper
                  radius={18}
                  p="md"
                  style={{
                    background: "rgba(255, 255, 255, 0.88)",
                    border: "1px solid rgba(255, 255, 255, 0.75)",
                    boxShadow: "0 16px 38px rgba(15, 23, 42, 0.08)",
                  }}
                >
                  <Stack gap="md">
                    <ThemeIcon variant="gradient" gradient={{ from: "orange", to: "pink" }} radius="xl">
                      <SlidersHorizontal size={17} />
                    </ThemeIcon>

                    <AiFilterChips filters={filtersApplied} />

                    {!hasFilters && (
                      <Text size="sm" c="dimmed">
                        {loading ? searchCopy.filtersLoading : searchCopy.filtersEmpty}
                      </Text>
                    )}

                    {tips?.length > 0 && (
                      <>
                        <Divider />
                        <Stack gap="xs">
                          {tips.map((tip) => (
                            <Text key={tip} size="sm" c="dimmed">
                              {tip}
                            </Text>
                          ))}
                        </Stack>
                      </>
                    )}
                  </Stack>
                </Paper>
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 9 }}>
              <Stack gap="md">
                <Group justify="space-between" align="end">
                  <div>
                    <Title order={3} style={{ color: "#111827" }}>{searchCopy.resultsTitle}</Title>
                    <Text size="sm" c="dimmed">
                      {loading ? searchCopy.resultsLoadingSubtitle : resultSubtitle}
                    </Text>
                  </div>
                  {(hasSearched || loading) && (
                    <Group gap="xs">
                      <Badge variant="white" color="orange" size="lg" radius="xl" leftSection={<Hotel size={14} />}>
                        {loading ? searchCopy.searchingBadge : `${matchCount} ${searchCopy.matchesSuffix}`}
                      </Badge>
                      {!isUnsupported && !loading && (
                        <Badge variant="white" color="teal" size="lg" radius="xl" leftSection={<Clock3 size={14} />}>
                          {searchCopy.liveSearchBadge}
                        </Badge>
                      )}
                    </Group>
                  )}
                </Group>

                {loading ? (
                  <Paper
                    radius={22}
                    p="xl"
                    style={{
                      background: "rgba(255, 255, 255, 0.9)",
                      border: "1px solid rgba(255, 255, 255, 0.76)",
                      boxShadow: "0 18px 42px rgba(15, 23, 42, 0.09)",
                    }}
                  >
                    <Stack gap="lg">
                      <Group justify="space-between" align="center">
                        <Group gap="sm">
                          <ThemeIcon size={56} radius="xl" variant="light" color="orange">
                            <Loader size={24} color="orange" />
                          </ThemeIcon>
                          <div>
                            <Title order={4}>{resultsState.title}</Title>
                            <Text size="sm" c="dimmed">
                              {resultsState.description}
                            </Text>
                          </div>
                        </Group>
                        <Badge variant="light" color="orange" radius="xl">
                          {searchCopy.aiWorkingBadge}
                        </Badge>
                      </Group>

                      <SimpleGrid cols={{ base: 1, xl: 2 }} spacing="md">
                        {[1, 2].map((item) => (
                          <Paper
                            key={item}
                            radius="lg"
                            p="md"
                            style={{ border: "1px solid rgba(15, 23, 42, 0.08)" }}
                          >
                            <Stack gap="sm">
                              <Skeleton height={150} radius="md" />
                              <Skeleton height={18} width="72%" />
                              <Skeleton height={14} width="48%" />
                              <Group justify="space-between">
                                <Skeleton height={24} width={96} />
                                <Skeleton height={34} width={92} radius="md" />
                              </Group>
                            </Stack>
                          </Paper>
                        ))}
                      </SimpleGrid>
                    </Stack>
                  </Paper>
                ) : !hasHotels ? (
                  <Paper
                    radius={22}
                    p="xl"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255, 255, 255, 0.92), rgba(255, 247, 237, 0.82))",
                      border: "1px solid rgba(255, 255, 255, 0.78)",
                      boxShadow: "0 18px 42px rgba(15, 23, 42, 0.08)",
                    }}
                  >
                    <Stack align="center" gap="sm" py={54}>
                      <ThemeIcon size={62} radius="xl" variant="gradient" gradient={{ from: "orange", to: "pink" }}>
                        <Search size={24} />
                      </ThemeIcon>
                      <Title order={3} ta="center" style={{ color: "#111827" }}>{resultsState.title}</Title>
                      <Text size="md" c="dimmed" ta="center" maw={500}>
                        {resultsState.description}
                      </Text>
                    </Stack>
                  </Paper>
                ) : (
                  <SimpleGrid cols={{ base: 1, xl: 2 }} spacing="md">
                    {hotelCards.map((card) => (
                      <AiHotelCard key={card.key} card={card} />
                    ))}
                  </SimpleGrid>
                )}
              </Stack>
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
};

const AiHotelSearch = () => (
  <AiSearchProvider>
    <AiHotelSearchContent />
  </AiSearchProvider>
);

export default AiHotelSearch;
