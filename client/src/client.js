import { createClient } from "@supabase/supabase-js";

const URL = "https://pzwfdeilrskfiotdgqts.supabase.co";

const API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6d2ZkZWlscnNrZmlvdGRncXRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ1NjYwNDUsImV4cCI6MjA0MDE0MjA0NX0.SgBtnJMJO6nYIGEjupb1EWsx7ocCvChqivXtwiSNxlQ";

export const supabase = createClient(URL, API_KEY);
