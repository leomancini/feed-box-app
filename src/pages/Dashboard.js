import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: #ffffff;
`;

const Header = styled.header`
  background: white;
  border-bottom: 2px solid #000000;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.h1`
  color: #000000;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserInfo = styled.div`
  text-align: right;
`;

const UserName = styled.div`
  font-weight: 600;
  color: #000000;
`;

const UserEmail = styled.div`
  font-size: 0.875rem;
  color: #666666;
`;

const UserRole = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== "isAdmin"
})`
  background: ${(props) => (props.isAdmin ? "#000000" : "#666666")};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  margin-left: 0.5rem;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #000000;
`;

const Button = styled.button`
  background: ${(props) =>
    props.variant === "danger" ? "#000000" : "#666666"};
  color: white;
  border: 2px solid
    ${(props) => (props.variant === "danger" ? "#000000" : "#666666")};
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: white;
    color: ${(props) => (props.variant === "danger" ? "#000000" : "#666666")};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.3);
  }
`;

const Content = styled.main`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

// Device-related styled components
const DevicesContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  border: 2px solid #000000;
  margin-bottom: 2rem;
`;

const DevicesTitle = styled.h3`
  color: #000000;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DeviceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`;

const DeviceCard = styled.div`
  border: 2px solid #000000;
  border-radius: 8px;
  padding: 1.5rem;
  background: #ffffff;
  transition: all 0.2s;
  position: relative;

  &:hover {
    background: #f5f5f5;
    border-color: #666666;
  }
`;

const DeviceName = styled.h4`
  margin: 0 0 0.5rem 0;
  color: #000000;
  font-size: 1.1rem;
`;

const DeviceInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InfoLabel = styled.span`
  color: #666666;
  font-size: 0.875rem;
`;

const InfoValue = styled.span`
  color: #000000;
  font-weight: 500;
  font-size: 0.875rem;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666666;
`;

const ErrorState = styled.div`
  background: #f5f5f5;
  border: 2px solid #000000;
  color: #000000;
  padding: 1rem;
  border-radius: 6px;
  text-align: center;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: #666666;
`;

const RefreshButton = styled.button`
  background: #666666;
  color: white;
  border: 2px solid #666666;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  margin-left: auto;
  transition: all 0.2s;

  &:hover {
    background: white;
    color: #666666;
  }

  &:disabled {
    background: #cccccc;
    border-color: #cccccc;
    color: white;
    cursor: not-allowed;
  }
`;

const DeviceIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${(props) =>
    props.type === "desktop"
      ? "#000000"
      : props.type === "mobile"
      ? "#666666"
      : "#333333"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const EditButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #666666;
  color: white;
  border: 2px solid #666666;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  opacity: 0;
  transition: all 0.2s;

  ${DeviceCard}:hover & {
    opacity: 1;
  }

  &:hover {
    background: white;
    color: #666666;
  }

  &:focus {
    opacity: 1;
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.3);
  }
`;

// Modal and form styled components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  border: 3px solid #000000;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h3`
  margin: 0;
  color: #000000;
  font-size: 1.25rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666666;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;

  &:hover {
    background: #f5f5f5;
    color: #000000;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #000000;
  font-size: 0.875rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid #000000;
  border-radius: 6px;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #666666;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 2px solid #000000;
  border-radius: 6px;
  font-size: 0.875rem;
  background: white;

  &:focus {
    outline: none;
    border-color: #666666;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const CreateButton = styled.button`
  background: #000000;
  color: white;
  border: 2px solid #000000;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  margin-left: 0.5rem;
  transition: all 0.2s;

  &:hover {
    background: white;
    color: #000000;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    background: #cccccc;
    border-color: #cccccc;
    color: white;
    cursor: not-allowed;
  }
`;

const SerialNumberContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SerialInput = styled.input`
  padding: 0.75rem;
  border: 2px solid #000000;
  border-radius: 6px;
  font-size: 1rem;
  text-align: center;
  text-transform: uppercase;
  font-weight: 500;
  transition: border-color 0.2s;
  width: ${(props) => (props.maxLength === "1" ? "3rem" : "4rem")};

  &:focus {
    outline: none;
    border-color: #666666;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
  }

  &::placeholder {
    text-transform: none;
    font-weight: normal;
    color: #666666;
  }
`;

const SerialSeparator = styled.span`
  font-size: 1.25rem;
  font-weight: 600;
  color: #000000;
`;

const Dashboard = () => {
  const { user, logout, isAdmin, makeAuthenticatedRequest } = useAuth();
  const navigate = useNavigate();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [sources, setSources] = useState([]);
  const [sourcesLoading, setSourcesLoading] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    serialNumber: "",
    name: "",
    source: "",
    timezone: "America/New_York"
  });

  // Separate state for serial number parts
  const [serialParts, setSerialParts] = useState({
    letter: "",
    firstDigits: "",
    secondDigits: ""
  });

  // Refs for auto-advancing inputs
  const firstDigitsRef = useRef(null);
  const secondDigitsRef = useRef(null);

  // Standalone fetchDevices function for manual calls
  const fetchDevices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Admin users see all devices, regular users see only their own
      const endpoint = isAdmin ? "/devices/admin/all" : "/devices";
      const response = await makeAuthenticatedRequest(endpoint);
      setDevices(response.devices || []);
    } catch (error) {
      setError(error.message || "Failed to fetch devices");
    } finally {
      setLoading(false);
    }
  }, [isAdmin, makeAuthenticatedRequest]);

  useEffect(() => {
    const fetchSources = async () => {
      setSourcesLoading(true);
      try {
        const response = await makeAuthenticatedRequest("/sources/list");
        setSources(response.sources || response || []);
        // Set default source to first available source
        const sourcesArray = response.sources || response || [];
        if (sourcesArray.length > 0) {
          setCreateFormData((prev) => {
            // Only set if not already set
            if (!prev.source) {
              return {
                ...prev,
                source:
                  sourcesArray[0].id || sourcesArray[0].name || sourcesArray[0]
              };
            }
            return prev;
          });
        }
      } catch (error) {
        // Fallback to default sources if API fails
        setSources([
          { id: "headlines", name: "Headlines" },
          { id: "manual", name: "Manual" }
        ]);
        setCreateFormData((prev) => {
          // Only set if not already set
          if (!prev.source) {
            return {
              ...prev,
              source: "headlines"
            };
          }
          return prev;
        });
      } finally {
        setSourcesLoading(false);
      }
    };

    fetchDevices();
    fetchSources();
  }, [fetchDevices, makeAuthenticatedRequest]); // Include fetchDevices dependency

  const getDeviceIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "desktop":
      case "laptop":
        return "💻";
      case "mobile":
      case "phone":
        return "📱";
      case "tablet":
        return "📱";
      default:
        return "📟";
    }
  };

  const handleEditDevice = (device) => {
    const serialNumber = device.serialNumber || device.id;
    navigate(`/device/edit/${encodeURIComponent(serialNumber)}`);
  };

  const handleCreateDevice = async (e) => {
    e.preventDefault();
    setCreateLoading(true);

    try {
      // Ensure source is a string value, not an object, and exclude name field
      const deviceData = {
        serialNumber: createFormData.serialNumber,
        source:
          typeof createFormData.source === "object"
            ? createFormData.source.id ||
              createFormData.source.name ||
              JSON.stringify(createFormData.source)
            : createFormData.source,
        timezone: createFormData.timezone
      };

      await makeAuthenticatedRequest("/devices/admin/create-unlinked", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(deviceData)
      });

      // Reset form and close modal
      setCreateFormData({
        serialNumber: "",
        name: "",
        source:
          sources.length > 0
            ? sources[0].id || sources[0].name || sources[0]
            : "",
        timezone: "America/New_York"
      });
      setSerialParts({
        letter: "",
        firstDigits: "",
        secondDigits: ""
      });
      setShowCreateModal(false);

      // Refresh the devices list
      await fetchDevices();
    } catch (error) {
      setError(error.message || "Failed to create device");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCreateFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSerialPartChange = (part, value, nextInputRef) => {
    let processedValue = value;

    if (part === "letter") {
      // Only allow letters, convert to uppercase, max 1 character
      processedValue = value
        .replace(/[^A-Za-z]/g, "")
        .toUpperCase()
        .slice(0, 1);
      if (processedValue && nextInputRef?.current) {
        nextInputRef.current.focus();
      }
    } else {
      // Only allow digits, max 3 characters
      processedValue = value.replace(/[^0-9]/g, "").slice(0, 3);
      if (processedValue.length === 3 && nextInputRef?.current) {
        nextInputRef.current.focus();
      }
    }

    setSerialParts((prev) => ({
      ...prev,
      [part]: processedValue
    }));

    // Update the combined serial number in form data
    const newParts = { ...serialParts, [part]: processedValue };
    const combinedSerial = `${newParts.letter}-${newParts.firstDigits}-${newParts.secondDigits}`;
    setCreateFormData((prev) => ({
      ...prev,
      serialNumber: combinedSerial
    }));
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setCreateFormData({
      serialNumber: "",
      name: "",
      source:
        sources.length > 0
          ? sources[0].id || sources[0].name || sources[0]
          : "",
      timezone: "America/New_York"
    });
    setSerialParts({
      letter: "",
      firstDigits: "",
      secondDigits: ""
    });
  };

  const renderDevices = () => {
    if (loading) {
      return (
        <DevicesContainer>
          <DevicesTitle>
            🔌 {isAdmin ? "All Devices" : "My Devices"}
          </DevicesTitle>
          <LoadingState>Loading your devices...</LoadingState>
        </DevicesContainer>
      );
    }

    if (error) {
      return (
        <DevicesContainer>
          <DevicesTitle>
            🔌 {isAdmin ? "All Devices" : "My Devices"}
            <RefreshButton onClick={fetchDevices}>Retry</RefreshButton>
          </DevicesTitle>
          <ErrorState>Error loading devices: {error}</ErrorState>
        </DevicesContainer>
      );
    }

    return (
      <DevicesContainer>
        <DevicesTitle>
          🔌 {isAdmin ? "All Devices" : "My Devices"} ({devices.length})
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {isAdmin && (
              <CreateButton onClick={() => setShowCreateModal(true)}>
                + Create Device
              </CreateButton>
            )}
            <RefreshButton onClick={fetchDevices} disabled={loading}>
              {loading ? "Refreshing..." : "Refresh"}
            </RefreshButton>
          </div>
        </DevicesTitle>

        {devices.length === 0 ? (
          <EmptyState>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📱</div>
            <h4>No devices connected</h4>
            <p>Connect your first device to get started with FeedBox.</p>
          </EmptyState>
        ) : (
          <DeviceGrid>
            {devices.map((device) => (
              <DeviceCard key={device.serialNumber || device.id}>
                <EditButton
                  onClick={() => handleEditDevice(device)}
                  title="Edit device"
                >
                  ✏️
                </EditButton>

                <DeviceIcon type={device.type}>
                  {getDeviceIcon(device.type)}
                </DeviceIcon>

                <DeviceName>
                  {device.name ||
                    device.serialNumber ||
                    `${device.type || "Device"} ${device.id?.slice(-4)}`}
                </DeviceName>

                <DeviceInfo>
                  {isAdmin && (
                    <InfoRow>
                      <InfoLabel>Owner</InfoLabel>
                      <InfoValue>
                        {device.owner
                          ? device.owner.name || device.owner.email || "Unknown"
                          : "None"}
                      </InfoValue>
                    </InfoRow>
                  )}

                  {device.source && (
                    <InfoRow>
                      <InfoLabel>Source</InfoLabel>
                      <InfoValue>{device.source}</InfoValue>
                    </InfoRow>
                  )}

                  {device.type && (
                    <InfoRow>
                      <InfoLabel>Type</InfoLabel>
                      <InfoValue>{device.type}</InfoValue>
                    </InfoRow>
                  )}

                  {device.location && (
                    <InfoRow>
                      <InfoLabel>Location</InfoLabel>
                      <InfoValue>{device.location}</InfoValue>
                    </InfoRow>
                  )}

                  {device.version && (
                    <InfoRow>
                      <InfoLabel>Version</InfoLabel>
                      <InfoValue>{device.version}</InfoValue>
                    </InfoRow>
                  )}

                  <InfoRow>
                    <InfoLabel>Added</InfoLabel>
                    <InfoValue>
                      {device.createdAt
                        ? new Date(device.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric"
                            }
                          )
                        : "Unknown"}
                    </InfoValue>
                  </InfoRow>

                  <InfoRow>
                    <InfoLabel>Feed</InfoLabel>
                    <InfoValue>
                      <a
                        href={`${
                          process.env.REACT_APP_API_BASE_URL
                        }/devices/${encodeURIComponent(
                          device.serialNumber || device.id
                        )}/data`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#000000",
                          textDecoration: "none",
                          fontSize: "0.875rem"
                        }}
                        onMouseOver={(e) =>
                          (e.target.style.textDecoration = "underline")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.textDecoration = "none")
                        }
                      >
                        View Feed Data →
                      </a>
                    </InfoValue>
                  </InfoRow>
                </DeviceInfo>
              </DeviceCard>
            ))}
          </DeviceGrid>
        )}
      </DevicesContainer>
    );
  };

  return (
    <>
      <DashboardContainer>
        <Header>
          <Logo>FeedBox</Logo>
          <UserSection>
            <UserInfo>
              <UserName>
                {user?.name}
                <UserRole isAdmin={isAdmin}>{user?.role}</UserRole>
              </UserName>
              <UserEmail>{user?.email}</UserEmail>
            </UserInfo>
            {user?.picture && <Avatar src={user.picture} alt={user.name} />}
            <Button variant="danger" onClick={logout}>
              Logout
            </Button>
          </UserSection>
        </Header>

        <Content>{renderDevices()}</Content>
      </DashboardContainer>

      {showCreateModal && (
        <ModalOverlay
          onClick={(e) => e.target === e.currentTarget && handleCloseModal()}
        >
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Create New Device</ModalTitle>
              <CloseButton onClick={handleCloseModal}>×</CloseButton>
            </ModalHeader>

            <Form onSubmit={handleCreateDevice}>
              <FormGroup>
                <Label>Serial Number * (Format: A-123-123)</Label>
                <SerialNumberContainer>
                  <SerialInput
                    type="text"
                    value={serialParts.letter}
                    onChange={(e) =>
                      handleSerialPartChange(
                        "letter",
                        e.target.value,
                        firstDigitsRef
                      )
                    }
                    placeholder="A"
                    maxLength="1"
                    required
                  />
                  <SerialSeparator>-</SerialSeparator>
                  <SerialInput
                    ref={firstDigitsRef}
                    type="text"
                    value={serialParts.firstDigits}
                    onChange={(e) =>
                      handleSerialPartChange(
                        "firstDigits",
                        e.target.value,
                        secondDigitsRef
                      )
                    }
                    placeholder="123"
                    maxLength="3"
                    required
                  />
                  <SerialSeparator>-</SerialSeparator>
                  <SerialInput
                    ref={secondDigitsRef}
                    type="text"
                    value={serialParts.secondDigits}
                    onChange={(e) =>
                      handleSerialPartChange("secondDigits", e.target.value)
                    }
                    placeholder="123"
                    maxLength="3"
                    required
                  />
                </SerialNumberContainer>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="name">Device Name (optional)</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={createFormData.name}
                  onChange={handleFormChange}
                  placeholder="Enter device name"
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="source">Source</Label>
                <Select
                  id="source"
                  name="source"
                  value={createFormData.source}
                  onChange={handleFormChange}
                  disabled={sourcesLoading}
                >
                  {sourcesLoading ? (
                    <option value="">Loading sources...</option>
                  ) : sources.length > 0 ? (
                    sources.map((source, index) => (
                      <option
                        key={source.id || source.name || source || index}
                        value={source.id || source.name || source}
                      >
                        {source.name || source.id || source}
                      </option>
                    ))
                  ) : (
                    <option value="">No sources available</option>
                  )}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  id="timezone"
                  name="timezone"
                  value={createFormData.timezone}
                  onChange={handleFormChange}
                >
                  <option value="America/New_York">America/New_York</option>
                  <option value="America/Chicago">America/Chicago</option>
                  <option value="America/Denver">America/Denver</option>
                  <option value="America/Los_Angeles">
                    America/Los_Angeles
                  </option>
                  <option value="UTC">UTC</option>
                </Select>
              </FormGroup>

              <FormActions>
                <Button type="button" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createLoading}>
                  {createLoading ? "Creating..." : "Create Device"}
                </Button>
              </FormActions>
            </Form>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default Dashboard;
