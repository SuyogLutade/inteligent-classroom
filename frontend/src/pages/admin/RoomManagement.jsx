import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Plus, Building, Users, Star } from "lucide-react";

export default function RoomManagement() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  // Create form state
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState(60);
  const [building, setBuilding] = useState("Block A");
  const [floor, setFloor] = useState(1);
  const [equipmentInput, setEquipmentInput] = useState("");

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const data = await api.rooms.getAll();
      setRooms(data);
    } catch (err) {
      setError("Failed to fetch room utilization list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!id || !name) {
      setError("Required fields are missing");
      return;
    }
    try {
      const equipArray = equipmentInput
        ? equipmentInput.split(",").map((s) => s.trim())
        : [];
      await api.rooms.create({
        id,
        name,
        capacity: parseInt(capacity),
        building,
        floor: parseInt(floor),
        status: "available",
        equipment: equipArray,
      });
      setShowModal(false);
      setId("");
      setName("");
      setEquipmentInput("");
      fetchRooms();
    } catch (err) {
      setError("Failed to create room");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Room Management</h1>
          <p className="text-sm text-muted-foreground">Monitor and allocate lecture halls, labs, and classrooms</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Room
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-critical/10 text-critical text-sm rounded-lg border border-critical/20">
          {error}
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-muted-foreground">Loading room status...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((r) => {
            const statusColor =
              r.status === "active"
                ? "bg-healthy/10 text-healthy border-healthy/20"
                : r.status === "maintenance"
                ? "bg-critical/10 text-critical border-critical/20"
                : "bg-warning/10 text-warning border-warning/20";

            return (
              <Card key={r.id}>
                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <Building className="w-4.5 h-4.5 text-primary" />
                        {r.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">{r.building} · Floor {r.floor}</p>
                    </div>
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded border capitalize ${statusColor}`}>
                      {r.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs py-2 border-t border-b border-border">
                    <div>
                      <p className="text-muted-foreground">Capacity</p>
                      <p className="font-bold text-sm mt-0.5 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-primary" />
                        {r.capacity} Seats
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Utilization</p>
                      <p className="font-bold text-sm mt-0.5">
                        {r.utilization}%
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-muted-foreground">Equipment</p>
                    <div className="flex flex-wrap gap-1">
                      {r.equipment.map((eq, idx) => (
                        <Badge key={idx} variant="outline" className="text-[10px] py-px">
                          {eq}
                        </Badge>
                      ))}
                      {r.equipment.length === 0 && (
                        <span className="text-[10px] text-muted-foreground italic">None specified</span>
                      )}
                    </div>
                  </div>

                  {r.currentClass && (
                    <div className="pt-2 border-t border-border flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Ongoing Class:</span>
                      <span className="font-semibold text-primary">{r.currentClass}</span>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Room Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border p-6 rounded-xl w-full max-w-md shadow-xl animate-scale-in">
            <h2 className="text-lg font-bold mb-4">Add Room</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1">Room ID (unique)</label>
                <input
                  type="text"
                  placeholder="e.g. room-9"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  className="w-full p-2 border border-border bg-background rounded-lg text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Room Name</label>
                <input
                  type="text"
                  placeholder="e.g. Room 204"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-border bg-background rounded-lg text-sm"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1">Capacity</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="w-full p-2 border border-border bg-background rounded-lg text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Floor</label>
                  <input
                    type="number"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    className="w-full p-2 border border-border bg-background rounded-lg text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Building</label>
                <select
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  className="w-full p-2 border border-border bg-background rounded-lg text-sm"
                >
                  <option value="Block A">Block A</option>
                  <option value="Block B">Block B</option>
                  <option value="Block C">Block C</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Equipment (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Projector, AC, Smart Board"
                  value={equipmentInput}
                  onChange={(e) => setEquipmentInput(e.target.value)}
                  className="w-full p-2 border border-border bg-background rounded-lg text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Room</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
