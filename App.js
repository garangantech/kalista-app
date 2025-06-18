import React from "react";
import { View, Dimensions, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  propsForDots: {
    r: "4",
    strokeWidth: "2",
    stroke: "#007bff",
  },
};

const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      data: [30, 45, 28, 80, 99, 43],
      strokeWidth: 2,
    },
  ],
};

export default function App() {
  return (
    <View style={{ flex: 1, paddingTop: 50 }}>
      <Text style={{ textAlign: "center", fontSize: 18, marginBottom: 10 }}>
        Grafik Penjualan
      </Text>
      <LineChart
        data={data}
        width={screenWidth - 20}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={{
          marginHorizontal: 10,
          borderRadius: 10,
        }}
      />
    </View>
  );
}
