import { Container, Group, Text, Title } from '@mantine/core';
import { Illustration } from './Illustration';
import classes from './NothingFoundBackground.module.css';

export default function NothingFoundBackground() {
    return (
        <Container className={classes.root}>
            <div className={classes.inner}>
                <Illustration className={classes.image} />
                <div className={classes.content}>
                    <Title className={classes.title}>Página No Encontrada</Title>
                    <Text size="lg" align="center" className={classes.description}>
                        La página que está intentando acceder no existe.
                    </Text>
                    <Group position="center">
                        <button
                            className={classes.button}
                            onClick={() => (window.location.href = '/')}
                        >
                            Volver al menú principal
                        </button>
                    </Group>
                </div>
            </div>
        </Container>
    );
}
