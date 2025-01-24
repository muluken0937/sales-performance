import { AntDesign, FontAwesome5, Ionicons,Octicons } from '@expo/vector-icons';

export const icons = {
    index: (props) => <Ionicons name="home" size={26} {...props} />,
    explore: (props) => <FontAwesome5 name="clipboard-list" size={26}  {...props} />,
    create: (props) => <Octicons name="diff-added" size={26}  {...props} />,
    CreateCustomer: (props) => <Ionicons name="create" size={28}  {...props} />,
    profile: (props) => <Ionicons name="person" size={26}  {...props} />,
  };