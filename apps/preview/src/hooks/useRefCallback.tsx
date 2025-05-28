import { useState } from "react";

export const useRefCallback = <T,>() => useState<T | null>(null);
