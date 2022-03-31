package com.project.qresent.model;

import java.time.LocalDateTime;

public class Coordinates {
    LocalDateTime x;
    int y;

    public Coordinates(LocalDateTime x, int y) {
        this.x = x;
        this.y = y;
    }

    public LocalDateTime getX() {
        return x;
    }

    public void setX(LocalDateTime x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }
}