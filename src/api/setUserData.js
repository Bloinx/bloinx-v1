import supabase from "../supabase";

const setUserData = async (user) => {
  console.log(user);
  try {
    const { data, error } = await supabase
      .from("profiles")
      .insert([{ id: user?.id, username: "jeje", lastname: "ofl" }]);
    console.log(data);

    if (error) throw error;
  } catch (e) {
    alert(e.message);
  }
};

export default setUserData;
