import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useColors } from "@/hooks/useColors";

interface SeatMapProps {
  totalSeats: number;
  occupiedSeats: number[];
  selectedSeats: number[];
  onToggleSeat: (seat: number) => void;
  maxSelectable?: number;
}

export function SeatMap({
  totalSeats,
  occupiedSeats,
  selectedSeats,
  onToggleSeat,
  maxSelectable = 6,
}: SeatMapProps) {
  const colors = useColors();

  const rows: number[][] = [];
  for (let i = 1; i <= totalSeats; i += 4) {
    const row: number[] = [];
    for (let j = i; j < i + 4 && j <= totalSeats; j++) {
      row.push(j);
    }
    rows.push(row);
  }

  const getSeatStatus = (seat: number) => {
    if (occupiedSeats.includes(seat)) return "occupied";
    if (selectedSeats.includes(seat)) return "selected";
    return "available";
  };

  const handleSeatPress = (seat: number) => {
    const status = getSeatStatus(seat);
    if (status === "occupied") return;
    if (status === "available" && selectedSeats.length >= maxSelectable) return;
    onToggleSeat(seat);
  };

  return (
    <View>
      <View
        style={[
          styles.busTop,
          { backgroundColor: colors.primary, borderRadius: colors.radius },
        ]}
      >
        <Text style={[styles.busTopText, { color: colors.primaryForeground }]}>
          Conductor
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.seatsScroll}
        contentContainerStyle={styles.seatsContainer}
      >
        {rows.map((row, rowIdx) => (
          <View key={rowIdx} style={styles.row}>
            {row.map((seat, seatIdx) => {
              const status = getSeatStatus(seat);
              const isAisle = seatIdx === 2;

              return (
                <React.Fragment key={seat}>
                  {isAisle && <View style={styles.aisle} />}
                  <TouchableOpacity
                    style={[
                      styles.seat,
                      {
                        backgroundColor:
                          status === "occupied"
                            ? colors.seatOccupied
                            : status === "selected"
                            ? colors.seatSelected
                            : colors.seatAvailable,
                        borderRadius: 6,
                        borderWidth: status === "selected" ? 0 : 1,
                        borderColor:
                          status === "available"
                            ? colors.primary + "40"
                            : "transparent",
                      },
                    ]}
                    onPress={() => handleSeatPress(seat)}
                    disabled={status === "occupied"}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.seatNumber,
                        {
                          color:
                            status === "occupied"
                              ? colors.seatOccupiedText
                              : status === "selected"
                              ? colors.seatSelectedText
                              : colors.seatAvailableText,
                        },
                      ]}
                    >
                      {seat}
                    </Text>
                  </TouchableOpacity>
                </React.Fragment>
              );
            })}
          </View>
        ))}
      </ScrollView>

      <View style={styles.legend}>
        <LegendItem
          color={colors.seatAvailable}
          textColor={colors.seatAvailableText}
          label="Disponible"
          borderColor={colors.primary + "40"}
        />
        <LegendItem
          color={colors.seatSelected}
          textColor={colors.seatSelectedText}
          label="Seleccionado"
        />
        <LegendItem
          color={colors.seatOccupied}
          textColor={colors.seatOccupiedText}
          label="Ocupado"
        />
      </View>
    </View>
  );
}

function LegendItem({
  color,
  textColor,
  label,
  borderColor,
}: {
  color: string;
  textColor: string;
  label: string;
  borderColor?: string;
}) {
  const colors = useColors();
  return (
    <View style={styles.legendItem}>
      <View
        style={[
          styles.legendSwatch,
          {
            backgroundColor: color,
            borderRadius: 4,
            borderWidth: borderColor ? 1 : 0,
            borderColor: borderColor ?? "transparent",
          },
        ]}
      >
        <Text style={[styles.legendSwatchText, { color: textColor }]}>0</Text>
      </View>
      <Text style={[styles.legendLabel, { color: colors.mutedForeground }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  busTop: {
    marginHorizontal: 40,
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  busTopText: {
    fontWeight: "700",
    fontSize: 13,
  },
  seatsScroll: {
    maxHeight: 320,
  },
  seatsContainer: {
    alignItems: "center",
    gap: 8,
    paddingBottom: 8,
  },
  row: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  aisle: {
    width: 20,
  },
  seat: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  seatNumber: {
    fontSize: 13,
    fontWeight: "700",
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginTop: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendSwatch: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  legendSwatchText: {
    fontSize: 11,
    fontWeight: "700",
  },
  legendLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
});
