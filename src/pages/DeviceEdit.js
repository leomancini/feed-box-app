import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Container = styled.div`
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

const BackButton = styled.button`
  background: #cccccc;
  color: #000000;
  border: 2px solid #cccccc;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;

  &:hover {
    background: white;
    border-color: #000000;
  }
`;

const Content = styled.main`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const EditCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  border: 2px solid #000000;
`;

const Title = styled.h2`
  color: #000000;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #000000;
  font-size: 0.875rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid #000000;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #666666;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    background: #f5f5f5;
    color: #666666;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 2px solid #000000;
  border-radius: 6px;
  font-size: 1rem;
  background: white;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #666666;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;

  ${(props) => {
    if (props.variant === "primary") {
      return `
        background: #000000;
        color: white;
        border-color: #000000;
        &:hover:not(:disabled) {
          background: white;
          color: #000000;
        }
      `;
    }
    if (props.variant === "danger") {
      return `
        background: #000000;
        color: white;
        border-color: #000000;
        &:hover:not(:disabled) {
          background: white;
          color: #000000;
        }
      `;
    }
    return `
      background: white;
      color: #000000;
      border-color: #000000;
      &:hover:not(:disabled) {
        background: #f5f5f5;
        border-color: #666666;
      }
    `;
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.3);
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666666;
`;

const ErrorState = styled.div`
  background: #f5f5f5;
  border: 2px solid #000000;
  color: #000000;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
`;

const SuccessState = styled.div`
  background: #f5f5f5;
  border: 2px solid #000000;
  color: #000000;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
`;

const DevicePreview = styled.div`
  background: #f5f5f5;
  border: 2px solid #000000;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const PreviewTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  color: #000000;
  font-size: 0.875rem;
`;

const PreviewValue = styled.div`
  color: #666666;
  font-size: 0.875rem;
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

  &:disabled {
    background: #f5f5f5;
    color: #666666;
    cursor: not-allowed;
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

const DeviceEdit = () => {
  const { serialNumber } = useParams();
  const navigate = useNavigate();
  const { makeAuthenticatedRequest, isAdmin } = useAuth();

  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [sources, setSources] = useState([]);
  const [sourcesLoading, setSourcesLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    source: "",
    timezone: "",
    ownerId: ""
  });

  // Separate state for serial number parts (for display only, not editable)
  const [serialParts, setSerialParts] = useState({
    letter: "",
    firstDigits: "",
    secondDigits: ""
  });

  const timezones = [
    { value: "UTC", label: "UTC" },
    { value: "America/New_York", label: "Eastern Time" },
    { value: "America/Chicago", label: "Central Time" },
    { value: "America/Denver", label: "Mountain Time" },
    { value: "America/Los_Angeles", label: "Pacific Time" },
    { value: "Europe/London", label: "London" },
    { value: "Europe/Paris", label: "Paris" },
    { value: "Europe/Berlin", label: "Berlin" },
    { value: "Asia/Tokyo", label: "Tokyo" },
    { value: "Asia/Shanghai", label: "Shanghai" },
    { value: "Australia/Sydney", label: "Sydney" }
  ];

  // Function to parse serial number into parts
  const parseSerialNumber = (serial) => {
    if (!serial) return { letter: "", firstDigits: "", secondDigits: "" };

    const parts = serial.split("-");
    if (parts.length === 3) {
      return {
        letter: parts[0] || "",
        firstDigits: parts[1] || "",
        secondDigits: parts[2] || ""
      };
    }

    // Fallback for non-standard format
    return { letter: "", firstDigits: "", secondDigits: "" };
  };

  useEffect(() => {
    const fetchDevice = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await makeAuthenticatedRequest(
          `/devices/${encodeURIComponent(serialNumber)}`
        );
        const deviceData = response.device || response;
        setDevice(deviceData);
        setFormData({
          name: deviceData.name || "",
          source: deviceData.source || "",
          timezone: deviceData.timezone || "",
          ownerId: deviceData.owner?.id || ""
        });

        // Parse and set serial number parts for display
        const parts = parseSerialNumber(
          deviceData.serialNumber || deviceData.id
        );
        setSerialParts(parts);
      } catch (error) {
        setError(error.message || "Failed to fetch device");
      } finally {
        setLoading(false);
      }
    };

    fetchDevice();
  }, [makeAuthenticatedRequest, serialNumber]); // Direct dependencies

  useEffect(() => {
    // Fetch sources once on component mount
    const fetchSources = async () => {
      setSourcesLoading(true);
      try {
        const response = await makeAuthenticatedRequest("/sources/list");
        setSources(response.sources || response || []);
      } catch (error) {
        console.error("Failed to fetch sources:", error);
        setSources([]);
      } finally {
        setSourcesLoading(false);
      }
    };

    fetchSources();

    // Fetch users for admin users only
    const fetchUsers = async () => {
      if (!isAdmin) return;

      setUsersLoading(true);
      try {
        const response = await makeAuthenticatedRequest("/users/list");
        setUsers(response.users || response || []);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setUsers([]);
      } finally {
        setUsersLoading(false);
      }
    };

    fetchUsers();
  }, [makeAuthenticatedRequest, isAdmin]); // Include isAdmin as dependency

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // Send only the editable fields
      const dataToSend = {
        name: formData.name,
        source: formData.source,
        timezone: formData.timezone
      };

      // Include owner data if user is admin and ownerId is provided
      if (isAdmin && formData.ownerId) {
        dataToSend.ownerId = formData.ownerId;
      }

      await makeAuthenticatedRequest(
        `/devices/${encodeURIComponent(device.serialNumber || device.id)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(dataToSend)
        }
      );

      setSuccess(true);
      // Update the device state with new data
      setDevice((prev) => ({ ...prev, ...formData }));
    } catch (error) {
      setError(error.message || "Failed to update device");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const isUnlinking = !isAdmin;
    const actionText = isUnlinking ? "unlink" : "delete";
    const confirmMessage = isUnlinking
      ? "Are you sure you want to unlink this device from your account? The device will remain in the system but will no longer be associated with you."
      : "Are you sure you want to delete this device? This action cannot be undone.";

    if (!window.confirm(confirmMessage)) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (isUnlinking) {
        // For non-admins, unlink the device instead of deleting it
        await makeAuthenticatedRequest(
          `/devices/${encodeURIComponent(
            device.serialNumber || device.id
          )}/unlink`,
          {
            method: "POST"
          }
        );
      } else {
        // For admins, delete the device entirely
        await makeAuthenticatedRequest(
          `/devices/${encodeURIComponent(device.serialNumber || device.id)}`,
          {
            method: "DELETE"
          }
        );
      }
      navigate("/dashboard");
    } catch (error) {
      setError(error.message || `Failed to ${actionText} device`);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <Header>
          <Logo>FeedBox</Logo>
          <BackButton onClick={() => navigate("/dashboard")}>
            ← Back to Dashboard
          </BackButton>
        </Header>
        <Content>
          <LoadingState>Loading device...</LoadingState>
        </Content>
      </Container>
    );
  }

  if (!device) {
    return (
      <Container>
        <Header>
          <Logo>FeedBox</Logo>
          <BackButton onClick={() => navigate("/dashboard")}>
            ← Back to Dashboard
          </BackButton>
        </Header>
        <Content>
          <ErrorState>Device not found</ErrorState>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Logo>FeedBox</Logo>
        <BackButton onClick={() => navigate("/dashboard")}>
          ← Back to Dashboard
        </BackButton>
      </Header>

      <Content>
        <EditCard>
          <Title>⚙️ Edit Device</Title>

          {error && <ErrorState>{error}</ErrorState>}
          {success && <SuccessState>Device updated successfully!</SuccessState>}

          <DevicePreview>
            <PreviewTitle>Device Serial Number</PreviewTitle>
            <SerialNumberContainer>
              <SerialInput
                type="text"
                value={serialParts.letter}
                disabled
                maxLength="1"
              />
              <SerialSeparator>-</SerialSeparator>
              <SerialInput
                type="text"
                value={serialParts.firstDigits}
                disabled
                maxLength="3"
              />
              <SerialSeparator>-</SerialSeparator>
              <SerialInput
                type="text"
                value={serialParts.secondDigits}
                disabled
                maxLength="3"
              />
            </SerialNumberContainer>
            {device.source && (
              <>
                <PreviewTitle style={{ marginTop: "1rem" }}>
                  Current Data Source
                </PreviewTitle>
                <PreviewValue>{device.source}</PreviewValue>
              </>
            )}
            {device.timezone && (
              <>
                <PreviewTitle style={{ marginTop: "1rem" }}>
                  Current Timezone
                </PreviewTitle>
                <PreviewValue>{device.timezone}</PreviewValue>
              </>
            )}
            {device.owner && (
              <>
                <PreviewTitle style={{ marginTop: "1rem" }}>
                  Current Owner
                </PreviewTitle>
                <PreviewValue>
                  {device.owner.name || device.owner.email || "Unknown"}
                </PreviewValue>
              </>
            )}
          </DevicePreview>

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="name">
                Device Name
                <span
                  style={{
                    color: "#666666",
                    fontSize: "0.75rem",
                    marginLeft: "0.5rem"
                  }}
                >
                  (Optional)
                </span>
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter device name"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="source">
                Data Source
                {sourcesLoading && (
                  <span
                    style={{
                      color: "#666666",
                      fontSize: "0.75rem",
                      marginLeft: "0.5rem"
                    }}
                  >
                    (Loading...)
                  </span>
                )}
              </Label>
              <Select
                id="source"
                value={formData.source}
                onChange={(e) => handleInputChange("source", e.target.value)}
                disabled={sourcesLoading}
              >
                <option value="">Select a data source</option>
                {sources.map((source) => (
                  <option
                    key={source.name || source}
                    value={source.name || source}
                  >
                    {source.label || source.name || source}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                id="timezone"
                value={formData.timezone}
                onChange={(e) => handleInputChange("timezone", e.target.value)}
              >
                <option value="">Select timezone</option>
                {timezones.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </Select>
            </FormGroup>

            {isAdmin && (
              <FormGroup>
                <Label htmlFor="owner">
                  Device Owner
                  {usersLoading && (
                    <span
                      style={{
                        color: "#666666",
                        fontSize: "0.75rem",
                        marginLeft: "0.5rem"
                      }}
                    >
                      (Loading...)
                    </span>
                  )}
                </Label>
                <Select
                  id="owner"
                  value={formData.ownerId}
                  onChange={(e) => handleInputChange("ownerId", e.target.value)}
                  disabled={usersLoading}
                >
                  <option value="">Select device owner</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name || user.email}{" "}
                      {user.email && user.name ? `(${user.email})` : ""}
                    </option>
                  ))}
                </Select>
              </FormGroup>
            )}

            <ButtonGroup>
              <Button
                type="button"
                variant="danger"
                onClick={handleDelete}
                disabled={saving}
              >
                {isAdmin ? "Delete Device" : "Unlink Device"}
              </Button>
              <Button
                type="button"
                onClick={() => navigate("/dashboard")}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </ButtonGroup>
          </Form>
        </EditCard>
      </Content>
    </Container>
  );
};

export default DeviceEdit;
