export type Criteria<T> = {
  field: string;
  operator: "equals" | "not_equals" | "in" | "not_in" | "greater_than" | "greater_than_or_equal" | "less_than" | "less_than_or_equal" | "contains" | "not_contains" | "starts_with" | "ends_with";
  value: Array<T>;
};
